import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type FeedItemType = "event" | "restaurant" | "hostel_activity" | "banner" | "curiosity" | "calendar";

interface FeedItem {
  id?: string;
  type: FeedItemType;
  emoji: string;
  title_en: string;
  title_es: string;
  subtitle_en: string;
  subtitle_es: string;
  description_en: string;
  description_es: string;
  cta_label_en: string;
  cta_label_es: string;
  cta_action: string;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  sort_order: number;
  day_of_week: number | null;
  month: number | null;
}

const EMPTY: FeedItem = {
  type: "event",
  emoji: "📌",
  title_en: "", title_es: "",
  subtitle_en: "", subtitle_es: "",
  description_en: "", description_es: "",
  cta_label_en: "", cta_label_es: "",
  cta_action: "",
  starts_at: "", ends_at: "",
  is_active: true,
  sort_order: 0,
  day_of_week: null,
  month: null,
};

interface FeedEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  itemId: string | null;
}

export function FeedEditor({ isOpen, onClose, onSaved, itemId }: FeedEditorProps) {
  const [form, setForm] = useState<FeedItem>(EMPTY);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const isEditing = !!itemId;

  useEffect(() => {
    if (!isOpen) return;
    if (itemId) {
      setIsFetching(true);
      supabase.from("feed_items").select("*").eq("id", itemId).single()
        .then(({ data, error }) => {
          if (error || !data) {
            toast({ variant: "destructive", title: "Error", description: "Could not load item." });
            onClose();
          } else {
            setForm({
              ...EMPTY,
              ...data,
              emoji: data.emoji || "📌",
              subtitle_en: data.subtitle_en || "",
              subtitle_es: data.subtitle_es || "",
              description_en: data.description_en || "",
              description_es: data.description_es || "",
              cta_label_en: data.cta_label_en || "",
              cta_label_es: data.cta_label_es || "",
              cta_action: data.cta_action || "",
              starts_at: data.starts_at ? data.starts_at.slice(0, 16) : "",
              ends_at:   data.ends_at   ? data.ends_at.slice(0, 16)   : "",
            });
          }
          setIsFetching(false);
        });
    } else {
      setForm(EMPTY);
    }
  }, [isOpen, itemId]);

  const set = (field: keyof FeedItem, value: string | boolean | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!form.title_en.trim() || !form.title_es.trim()) {
      toast({ variant: "destructive", title: "Required", description: "Both title fields are required." });
      return;
    }
    setIsSaving(true);

    const payload = {
      ...form,
      starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
      ends_at:   form.ends_at   ? new Date(form.ends_at).toISOString()   : null,
    };

    const { error } = isEditing
      ? await supabase.from("feed_items").update(payload).eq("id", itemId!)
      : await supabase.from("feed_items").insert(payload);

    setIsSaving(false);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      onSaved();
    }
  };

  const typeLabels: Record<FeedItemType, string> = {
    event: "🎉 Event",
    restaurant: "🍽️ Restaurant",
    hostel_activity: "🏠 Hostel Activity",
    banner: "📢 Banner / Announcement",
    curiosity: "🌴 Curiosity / Did you know?",
    calendar: "📅 Monthly Calendar",
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Feed Item" : "New Feed Item"}</DialogTitle>
        </DialogHeader>

        {isFetching ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => set("type", v as FeedItemType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(typeLabels) as FeedItemType[]).map((t) => (
                      <SelectItem key={t} value={t}>{typeLabels[t]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Emoji</Label>
                <Input value={form.emoji} onChange={(e) => set("emoji", e.target.value)} placeholder="🎭" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Title (EN) *</Label>
                <Input value={form.title_en} onChange={(e) => set("title_en", e.target.value)} placeholder="Carnival Week" />
              </div>
              <div className="space-y-1.5">
                <Label>Título (ES) *</Label>
                <Input value={form.title_es} onChange={(e) => set("title_es", e.target.value)} placeholder="Semana de Carnaval" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Subtitle (EN)</Label>
                <Input value={form.subtitle_en} onChange={(e) => set("subtitle_en", e.target.value)} placeholder="Santa Cruz & Puerto de la Cruz" />
              </div>
              <div className="space-y-1.5">
                <Label>Subtítulo (ES)</Label>
                <Input value={form.subtitle_es} onChange={(e) => set("subtitle_es", e.target.value)} placeholder="Santa Cruz y Puerto de la Cruz" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Description (EN)</Label>
                <Textarea rows={4} value={form.description_en} onChange={(e) => set("description_en", e.target.value)} placeholder="Use \n for line breaks" className="resize-none" />
              </div>
              <div className="space-y-1.5">
                <Label>Descripción (ES)</Label>
                <Textarea rows={4} value={form.description_es} onChange={(e) => set("description_es", e.target.value)} placeholder="Usa \n para saltos de línea" className="resize-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Button label (EN)</Label>
                <Input value={form.cta_label_en} onChange={(e) => set("cta_label_en", e.target.value)} placeholder="Learn more" />
              </div>
              <div className="space-y-1.5">
                <Label>Texto del botón (ES)</Label>
                <Input value={form.cta_label_es} onChange={(e) => set("cta_label_es", e.target.value)} placeholder="Saber más" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Button action</Label>
              <Input
                value={form.cta_action}
                onChange={(e) => set("cta_action", e.target.value)}
                placeholder="Chat query, https://... link, or leave empty to open chat"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty → opens chat · Start with https:// → opens external link · Any other text → sends as chat message
              </p>
            </div>

            {form.type === "curiosity" && (
              <div className="space-y-1.5">
                <Label>Day of week</Label>
                <Select value={form.day_of_week !== null ? String(form.day_of_week) : ""} onValueChange={(v) => set("day_of_week", parseInt(v))}>
                  <SelectTrigger><SelectValue placeholder="Select day..." /></SelectTrigger>
                  <SelectContent>
                    {[
                      { value: "1", label: "Monday / Lunes" },
                      { value: "2", label: "Tuesday / Martes" },
                      { value: "3", label: "Wednesday / Miércoles" },
                      { value: "4", label: "Thursday / Jueves" },
                      { value: "5", label: "Friday / Viernes" },
                      { value: "6", label: "Saturday / Sábado" },
                      { value: "0", label: "Sunday / Domingo" },
                    ].map((d) => (
                      <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  This curiosity will only show on the selected day.
                </p>
              </div>
            )}
            {form.type === "calendar" && (
              <div className="space-y-1.5">
                <Label>Month</Label>
                <Select value={form.month !== null ? String(form.month) : ""} onValueChange={(v) => set("month", parseInt(v))}>
                  <SelectTrigger><SelectValue placeholder="Select month..." /></SelectTrigger>
                  <SelectContent>
                    {[
                      { value: "1", label: "January / Enero" },
                      { value: "2", label: "February / Febrero" },
                      { value: "3", label: "March / Marzo" },
                      { value: "4", label: "April / Abril" },
                      { value: "5", label: "May / Mayo" },
                      { value: "6", label: "June / Junio" },
                      { value: "7", label: "July / Julio" },
                      { value: "8", label: "August / Agosto" },
                      { value: "9", label: "September / Septiembre" },
                      { value: "10", label: "October / Octubre" },
                      { value: "11", label: "November / Noviembre" },
                      { value: "12", label: "December / Diciembre" },
                    ].map((m) => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  This calendar item will only show during the selected month.
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Show from (optional)</Label>
                <Input type="datetime-local" value={form.starts_at} onChange={(e) => set("starts_at", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Hide after (optional)</Label>
                <Input type="datetime-local" value={form.ends_at} onChange={(e) => set("ends_at", e.target.value)} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground -mt-2">
              Leave both empty to always show while Active is ON.
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch id="is-active" checked={form.is_active} onCheckedChange={(v) => set("is_active", v)} />
                <Label htmlFor="is-active">Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <Label>Sort order:</Label>
                <Input type="number" value={form.sort_order} onChange={(e) => set("sort_order", parseInt(e.target.value) || 0)} className="w-20" />
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving || isFetching}>
            {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}