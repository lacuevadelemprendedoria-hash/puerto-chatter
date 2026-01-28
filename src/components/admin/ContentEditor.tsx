import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";
import { Language, useTranslations } from "@/lib/i18n";
import { z } from "zod";

type ContentCategory = Database["public"]["Enums"]["content_category"];

const contentSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be under 200 characters"),
  content: z.string().trim().min(1, "Content is required").max(5000, "Content must be under 5000 characters"),
});

interface ContentEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  category: ContentCategory;
  language: Language;
  contentId: string | null;
}

export function ContentEditor({
  isOpen,
  onClose,
  onSaved,
  category,
  language,
  contentId,
}: ContentEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();
  const t = useTranslations(language);

  const isEditing = !!contentId;

  useEffect(() => {
    if (isOpen && contentId) {
      // Fetch existing content for editing
      const fetchContent = async () => {
        setIsFetching(true);
        const { data, error } = await supabase
          .from("hostel_content")
          .select("*")
          .eq("id", contentId)
          .single();

        if (error) {
          console.error("Error fetching content:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load content",
          });
          onClose();
        } else if (data) {
          setTitle(data.title);
          setContent(data.content);
          setIsActive(data.is_active ?? true);
          setSortOrder(data.sort_order ?? 0);
        }
        setIsFetching(false);
      };
      fetchContent();
    } else if (isOpen) {
      // Reset form for new content
      setTitle("");
      setContent("");
      setIsActive(true);
      setSortOrder(0);
    }
  }, [isOpen, contentId, toast, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    const validation = contentSchema.safeParse({ title, content });
    if (!validation.success) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: validation.error.errors[0].message,
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isEditing) {
        const { error } = await supabase
          .from("hostel_content")
          .update({
            title: title.trim(),
            content: content.trim(),
            is_active: isActive,
            sort_order: sortOrder,
          })
          .eq("id", contentId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("hostel_content").insert({
          category,
          language,
          title: title.trim(),
          content: content.trim(),
          is_active: isActive,
          sort_order: sortOrder,
        });

        if (error) throw error;
      }

      onSaved();
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save content",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Content" : "Add Content"}
          </DialogTitle>
        </DialogHeader>

        {isFetching ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t.admin.title}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Check-in Time"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">{t.admin.contentLabel}</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter the information for guests..."
                rows={6}
                required
                disabled={isLoading}
                className="resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="is-active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  disabled={isLoading}
                />
                <Label htmlFor="is-active" className="text-sm">
                  Active
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="sort-order" className="text-sm">
                  Order:
                </Label>
                <Input
                  id="sort-order"
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                  className="w-20"
                  disabled={isLoading}
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                {t.admin.cancel}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  t.admin.save
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
