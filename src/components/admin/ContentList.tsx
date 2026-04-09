import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Edit2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Database } from "@/integrations/supabase/types";
import { Language } from "@/lib/i18n";

type ContentCategory = Database["public"]["Enums"]["content_category"];

interface ContentItem {
  id: string;
  title: string;
  content: string;
  sort_order: number | null;
  is_active: boolean | null;
}

interface ContentListProps {
  category: ContentCategory;
  language: Language;
  onEdit: (id: string) => void;
  onDeleted: () => void;
  refreshKey: number;
}

export function ContentList({ category, language, onEdit, onDeleted, refreshKey }: ContentListProps) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("hostel_content")
        .select("id, title, content, sort_order, is_active")
        .eq("category", category)
        .eq("language", language as "en" | "es")
        .order("sort_order");

      if (error) {
        console.error("Error fetching content:", error);
      } else {
        setItems(data || []);
      }
      setIsLoading(false);
    };

    fetchContent();
  }, [category, language, refreshKey]);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    const { error } = await supabase
      .from("hostel_content")
      .delete()
      .eq("id", deleteId);

    if (error) {
      console.error("Error deleting content:", error);
    } else {
      setItems((prev) => prev.filter((item) => item.id !== deleteId));
      onDeleted();
    }

    setIsDeleting(false);
    setDeleteId(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No content yet. Add your first entry!</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} className={!item.is_active ? "opacity-60" : ""}>
            <CardHeader className="py-3 px-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-medium truncate">
                    {item.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {item.content}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(item.id)}
                    className="h-8 w-8"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(item.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this content? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
