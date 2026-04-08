import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Building2, LogOut, Loader2, Plus, FileText, Rss, Settings } from "lucide-react";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { ContentList } from "@/components/admin/ContentList";
import { FeedEditor } from "@/components/admin/FeedEditor";
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

interface FeedItem {
  id: string;
  type: string;
  emoji: string;
  title_en: string;
  title_es: string;
  subtitle_en: string;
  is_active: boolean;
  sort_order: number;
}

interface ConfigRow {
  id: string;
  key: string;
  value: string;
  label: string | null;
  description: string | null;
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory>("check_in_out");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Feed tab
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [isFeedEditorOpen, setIsFeedEditorOpen] = useState(false);
  const [editingFeedId, setEditingFeedId] = useState<string | null>(null);

  // Config tab
  const [configRows, setConfigRows] = useState<ConfigRow[]>([]);
  const [configLoading, setConfigLoading] = useState(false);
  const [configValues, setConfigValues] = useState<Record<string, string>>({});
  const [configSaving, setConfigSaving] = useState(false);

  const [activeMainTab, setActiveMainTab] = useState("content");

  const navigate = useNavigate();
  const { toast } = useToast();
  const t = useTranslations(selectedLanguage);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/admin"); return; }
      const { data: adminData } = await supabase
        .from("admin_users").select("id").eq("user_id", session.user.id).maybeSingle();
      if (!adminData) { await supabase.auth.signOut(); navigate("/admin"); return; }
      setIsLoading(false);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate("/admin");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Load feed items when tab active
  useEffect(() => {
    if (activeMainTab !== "feed") return;
    loadFeedItems();
  }, [activeMainTab, refreshKey]);

  // Load config when tab active
  useEffect(() => {
    if (activeMainTab !== "config") return;
    loadConfig();
  }, [activeMainTab]);

  const loadFeedItems = async () => {
    setFeedLoading(true);
    const { data, error } = await supabase
      .from("feed_items")
      .select("id, type, emoji, title_en, title_es, subtitle_en, is_active, sort_order")
      .order("sort_order");
    if (!error && data) setFeedItems(data as FeedItem[]);
    setFeedLoading(false);
  };

  const loadConfig = async () => {
    setConfigLoading(true);
    const { data, error } = await supabase.from("hostel_config").select("*").order("key");
    if (!error && data) {
      setConfigRows(data as ConfigRow[]);
      const kv: Record<string, string> = {};
      for (const row of data as ConfigRow[]) kv[row.key] = row.value;
      setConfigValues(kv);
    }
    setConfigLoading(false);
  };

  const saveConfig = async () => {
    setConfigSaving(true);
    try {
      for (const row of configRows) {
        const newVal = configValues[row.key] ?? row.value;
        if (newVal === row.value) continue;
        const { error } = await supabase
          .from("hostel_config")
          .update({ value: newVal })
          .eq("id", row.id);
        if (error) throw error;
      }
      // Clear config cache so GuestStatusPanel refreshes
      try { sessionStorage.removeItem("nest_hostel_config"); } catch (err) { console.warn("Could not clear config cache:", err); }
      toast({ title: "Config saved", description: "Changes will appear immediately." });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: String(err) });
    } finally {
      setConfigSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const toggleFeedActive = async (id: string, current: boolean) => {
    await supabase.from("feed_items").update({ is_active: !current }).eq("id", id);
    setFeedItems((prev) => prev.map((i) => i.id === id ? { ...i, is_active: !current } : i));
  };

  const deleteFeedItem = async (id: string) => {
    if (!confirm("Delete this feed item?")) return;
    await supabase.from("feed_items").delete().eq("id", id);
    setFeedItems((prev) => prev.filter((i) => i.id !== id));
    toast({ title: "Feed item deleted" });
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
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background: 'linear-gradient(135deg, #0D6F82, #53CED1)'}}>
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground font-heading">Puerto Nest Admin</h1>
              <p className="text-xs text-muted-foreground font-body">Content Management</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container px-4 py-6">
        <Tabs value={activeMainTab} onValueChange={setActiveMainTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="content" className="gap-2">
              <FileText className="w-4 h-4" /> Content
            </TabsTrigger>
            <TabsTrigger value="feed" className="gap-2">
              <Rss className="w-4 h-4" /> Feed
            </TabsTrigger>
            <TabsTrigger value="config" className="gap-2">
              <Settings className="w-4 h-4" /> Config
            </TabsTrigger>
          </TabsList>

          {/* ── CONTENT TAB ── */}
          <TabsContent value="content">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl">Hostel Information</CardTitle>
                <div className="flex items-center gap-2">
                  <Tabs value={selectedLanguage} onValueChange={(v) => setSelectedLanguage(v as Language)}>
                    <TabsList className="h-9">
                      <TabsTrigger value="en" className="text-xs px-3">EN</TabsTrigger>
                      <TabsTrigger value="es" className="text-xs px-3">ES</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Button onClick={() => { setEditingContentId(null); setIsEditorOpen(true); }} size="sm" className="gap-1">
                    <Plus className="w-4 h-4" /> Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
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
                        onEdit={(id) => { setEditingContentId(id); setIsEditorOpen(true); }}
                        onDeleted={() => setRefreshKey((p) => p + 1)}
                        refreshKey={refreshKey}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
            {isEditorOpen && (
              <ContentEditor
                isOpen={isEditorOpen}
                onClose={() => { setIsEditorOpen(false); setEditingContentId(null); }}
                onSaved={() => {
                  setRefreshKey((p) => p + 1);
                  setIsEditorOpen(false);
                  setEditingContentId(null);
                  toast({ title: "Content saved" });
                }}
                category={selectedCategory}
                language={selectedLanguage}
                contentId={editingContentId}
              />
            )}
          </TabsContent>

          {/* ── FEED TAB ── */}
          <TabsContent value="feed">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-xl">Activity Feed</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cards shown to guests on the home screen
                  </p>
                </div>
                <Button onClick={() => { setEditingFeedId(null); setIsFeedEditorOpen(true); }} size="sm" className="gap-1">
                  <Plus className="w-4 h-4" /> Add Item
                </Button>
              </CardHeader>
              <CardContent>
                {feedLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                ) : feedItems.length === 0 ? (
                  <p className="text-center text-muted-foreground py-10">No feed items yet. Add your first one!</p>
                ) : (
                  <div className="space-y-3">
                    {feedItems.map((item) => (
                      <div key={item.id} className={`border rounded-xl p-4 flex items-center gap-3 ${!item.is_active ? "opacity-50" : ""}`}>
                        <span className="text-2xl">{item.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm truncate">{item.title_en}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">{item.type}</span>
                            {!item.is_active && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Hidden</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.subtitle_en}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button variant="ghost" size="sm" onClick={() => toggleFeedActive(item.id, item.is_active)}>
                            {item.is_active ? "Hide" : "Show"}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => { setEditingFeedId(item.id); setIsFeedEditorOpen(true); }}>
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteFeedItem(item.id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            {isFeedEditorOpen && (
              <FeedEditor
                isOpen={isFeedEditorOpen}
                onClose={() => { setIsFeedEditorOpen(false); setEditingFeedId(null); }}
                onSaved={() => {
                  setRefreshKey((p) => p + 1);
                  setIsFeedEditorOpen(false);
                  setEditingFeedId(null);
                  loadFeedItems();
                  toast({ title: "Feed item saved" });
                }}
                itemId={editingFeedId}
              />
            )}
          </TabsContent>

          {/* ── CONFIG TAB ── */}
          <TabsContent value="config">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-xl">Hostel Configuration</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Settings used across the app and AI assistant
                  </p>
                </div>
                <Button onClick={saveConfig} disabled={configSaving} className="gap-2">
                  {configSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Save Changes
                </Button>
              </CardHeader>
              <CardContent>
                {configLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                ) : (
                  <div className="space-y-4">
                    {configRows.map((row) => (
                      <div key={row.id} className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                          {row.label ?? row.key}
                        </label>
                        {row.description && (
                          <p className="text-xs text-muted-foreground">{row.description}</p>
                        )}
                        <input
                          type="text"
                          value={configValues[row.key] ?? ""}
                          onChange={(e) => setConfigValues((prev) => ({ ...prev, [row.key]: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                    ))}
                    {configRows.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        Run the migration SQL to create the hostel_config table first.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Replication Guide */}
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">🔁 Deploy to Another Nest Hostel</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>To deploy this app for a different Nest Hostel:</p>
                <ol className="list-decimal list-inside space-y-1.5 pl-2">
                  <li>Fork / duplicate the repo on GitHub</li>
                  <li>Edit <code className="bg-muted px-1 rounded text-xs">src/lib/hostel.config.ts</code> with the new hostel's details</li>
                  <li>Replace the logo at <code className="bg-muted px-1 rounded text-xs">src/assets/puerto-nest-logo.png</code></li>
                  <li>Create a new Supabase project and run all migrations</li>
                  <li>Set <code className="bg-muted px-1 rounded text-xs">ANTHROPIC_API_KEY</code> in Supabase Edge Function secrets</li>
                  <li>Update <code className="bg-muted px-1 rounded text-xs">.env</code> with the new Supabase URL and keys</li>
                  <li>Deploy to Lovable / Vercel / Netlify</li>
                </ol>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
