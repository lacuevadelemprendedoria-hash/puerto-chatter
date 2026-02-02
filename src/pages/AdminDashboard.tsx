import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Building2, LogOut, Loader2, Plus } from "lucide-react";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { ContentList } from "@/components/admin/ContentList";
import { AnalyticsCard } from "@/components/admin/AnalyticsCard";
import { Language, useTranslations } from "@/lib/i18n";
import type { Database } from "@/integrations/supabase/types";

type ContentCategory = Database["public"]["Enums"]["content_category"];

const categories: ContentCategory[] = [
  "check_in_out",
  "house_rules",
  "wifi",
  "kitchen",
  "laundry",
  "transport",
  "excursions",
  "where_to_eat_go_out",
];

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory>("check_in_out");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const t = useTranslations(selectedLanguage);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/admin");
        return;
      }

      // Check if user is admin
      const { data: adminData } = await supabase
        .from("admin_users")
        .select("id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!adminData) {
        await supabase.auth.signOut();
        navigate("/admin");
        return;
      }

      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        navigate("/admin");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been signed out.",
    });
    navigate("/admin");
  };

  const handleAddContent = () => {
    setEditingContentId(null);
    setIsEditorOpen(true);
  };

  const handleEditContent = (id: string) => {
    setEditingContentId(id);
    setIsEditorOpen(true);
  };

  const handleEditorClose = () => {
    setIsEditorOpen(false);
    setEditingContentId(null);
  };

  const handleContentSaved = () => {
    setRefreshKey((prev) => prev + 1);
    handleEditorClose();
    toast({
      title: "Content saved",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleContentDeleted = () => {
    setRefreshKey((prev) => prev + 1);
    toast({
      title: "Content deleted",
      description: "The content has been removed.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full welcome-gradient flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Puerto Nest Admin</h1>
              <p className="text-xs text-muted-foreground">Content Management</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 py-6 space-y-6">
        {/* Analytics */}
        <AnalyticsCard />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl">Manage Content</CardTitle>
            <div className="flex items-center gap-2">
              {/* Language selector */}
              <Tabs value={selectedLanguage} onValueChange={(v) => setSelectedLanguage(v as Language)}>
                <TabsList className="h-9">
                  <TabsTrigger value="en" className="text-xs px-3">English</TabsTrigger>
                  <TabsTrigger value="es" className="text-xs px-3">Español</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button onClick={handleAddContent} size="sm" className="gap-1">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Category tabs */}
            <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as ContentCategory)}>
              <TabsList className="flex flex-wrap h-auto gap-1 mb-4 bg-transparent p-0">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-3 py-1.5"
                  >
                    {t.admin.categories[category]}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category} value={category} className="mt-4">
                  <ContentList
                    category={category}
                    language={selectedLanguage}
                    onEdit={handleEditContent}
                    onDeleted={handleContentDeleted}
                    refreshKey={refreshKey}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Content Editor Dialog */}
        {isEditorOpen && (
          <ContentEditor
            isOpen={isEditorOpen}
            onClose={handleEditorClose}
            onSaved={handleContentSaved}
            category={selectedCategory}
            language={selectedLanguage}
            contentId={editingContentId}
          />
        )}
      </main>
    </div>
  );
}
