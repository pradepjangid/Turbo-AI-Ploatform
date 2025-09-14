"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useAI } from "@/contexts/ai-context";
import type { PromptTemplate } from "@/app/api/templates/route";
import { Plus, Edit, Trash2, Save } from "lucide-react";

export function TemplateManager({
  setShowTemplates,
  onClose,
}: {
  setShowTemplates?: (show: boolean) => void;
  onClose?: () => void;
}) {
  const { state, loadTemplate } = useAI();

  // Local state
  const [templates, setTemplates] = useState<PromptTemplate[]>(state.templates);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const initialTemplateState: Partial<PromptTemplate> = {
    name: "",
    description: "",
    category: "General",
    prompt: "",
    systemPrompt: "",
    parameters: {
      temperature: 0.7,
      maxTokens: 1000,
      topP: 1.0,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
    },
    tags: [],
    isPublic: true,
  };

  const [newTemplate, setNewTemplate] =
    useState<Partial<PromptTemplate>>(initialTemplateState);

  // Keep templates in sync with context state if it changes
  useEffect(() => {
    setTemplates(state.templates);
  }, [state.templates]);

  const categories = ["all", ...new Set(templates.map((t) => t.category))];

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  // CREATE TEMPLATE
  const handleSaveTemplate = async () => {
    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTemplate),
      });
      if (response.ok) {
        const saved: PromptTemplate = await response.json();
        setTemplates((prev) => [...prev, saved]);
        setIsCreateDialogOpen(false);
        setNewTemplate(initialTemplateState);
      }
    } catch (error) {
      console.error("Failed to save template:", error);
    }
  };

  // UPDATE TEMPLATE
  const handleUpdateTemplate = async (template: PromptTemplate) => {
    try {
      const response = await fetch(`/api/templates?id=${template.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(template),
      });
      if (response.ok) {
        const updated: PromptTemplate = await response.json();
        setTemplates((prev) =>
          prev.map((t) => (t.id === updated.id ? updated : t))
        );
        setEditingTemplate(null);
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to update template:", error);
    }
  };

  // DELETE TEMPLATE
  const handleDeleteTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/templates?id=${templateId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTemplates((prev) => prev.filter((t) => t.id !== templateId));
      }
    } catch (error) {
      console.error("Failed to delete template:", error);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search + Category + Create */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-[50%] text-sm"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* CREATE DIALOG */}
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" /> Create Template
              </Button>
            </DialogTrigger>

            <DialogContent className="w-[95vw] max-w-2xl h-[90vh] max-h-[90vh] sm:h-[80vh] sm:max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
              </DialogHeader>

              {/* Tabs */}
              <Tabs defaultValue="basic" className="w-full flex-1 min-h-0">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="parameters">Parameters</TabsTrigger>
                </TabsList>

                <div className="flex-1 min-h-0 overflow-auto">
                  {/* BASIC INFO */}
                  <TabsContent
                    value="basic"
                    className="space-y-3 sm:space-y-4 h-full overflow-y-auto"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Template Name</Label>
                        <Input
                          id="name"
                          value={newTemplate.name}
                          onChange={(e) =>
                            setNewTemplate({
                              ...newTemplate,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={newTemplate.category}
                          onChange={(e) =>
                            setNewTemplate({
                              ...newTemplate,
                              category: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={newTemplate.description}
                        onChange={(e) =>
                          setNewTemplate({
                            ...newTemplate,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>System Prompt</Label>
                      <Textarea
                        value={newTemplate.systemPrompt}
                        onChange={(e) =>
                          setNewTemplate({
                            ...newTemplate,
                            systemPrompt: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Main Prompt</Label>
                      <Textarea
                        value={newTemplate.prompt}
                        onChange={(e) =>
                          setNewTemplate({
                            ...newTemplate,
                            prompt: e.target.value,
                          })
                        }
                        rows={6}
                      />
                    </div>
                  </TabsContent>

                  {/* PARAMETERS */}
                  <TabsContent
                    value="parameters"
                    className="space-y-3 sm:space-y-4 h-full overflow-y-auto"
                  >
                    {newTemplate.parameters && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {Object.entries(newTemplate.parameters).map(
                          ([key, value]) => (
                            <div key={key} className="space-y-2">
                              <Label>
                                {key}: {value}
                              </Label>
                              <Slider
                                value={[value as number]}
                                onValueChange={([val]) =>
                                  setNewTemplate({
                                    ...newTemplate,
                                    parameters: {
                                      ...newTemplate.parameters!,
                                      [key]: val,
                                    },
                                  })
                                }
                                min={key === "frequencyPenalty" ? -2 : 0}
                                max={
                                  key === "maxTokens"
                                    ? 4000
                                    : key === "topP"
                                    ? 1
                                    : 2
                                }
                                step={key === "maxTokens" ? 100 : 0.1}
                              />
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveTemplate}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* TEMPLATE CARDS */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 max-h-[57vh] md:max-h-[75vh] overflow-y-auto">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 sm:pb-3 flex justify-between items-start">
              <div className="space-y-1 min-w-0 flex-1">
                <CardTitle className="text-base sm:text-lg truncate">
                  {template.name}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm line-clamp-2">
                  {template.description}
                </CardDescription>
              </div>

              <div className="flex gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingTemplate(template);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTemplate(template.id)}
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-2 sm:space-y-3">
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs">
                  {template.category}
                </Badge>
                {template.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Temp: {template.parameters.temperature} • Tokens:{" "}
                {template.parameters.maxTokens}
              </div>
              <Button
                className="w-full text-sm"
                onClick={() => {
                  loadTemplate(template),
                    setShowTemplates && setShowTemplates(false);
                  onClose && onClose();
                }}
              >
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* EDIT DIALOG */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        {editingTemplate && (
          <DialogContent className="w-[95vw] max-w-2xl h-[90vh] max-h-[90vh] sm:h-[80vh] sm:max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Edit Template</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="basic" className="w-full flex-1 min-h-0">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="parameters">Parameters</TabsTrigger>
              </TabsList>

              <div className="flex-1 min-h-0 overflow-auto">
                <TabsContent
                  value="basic"
                  className="space-y-3 sm:space-y-4 h-full overflow-y-auto"
                >
                  <Input
                    value={editingTemplate.name}
                    onChange={(e) =>
                      setEditingTemplate({
                        ...editingTemplate,
                        name: e.target.value,
                      })
                    }
                  />
                  <Input
                    value={editingTemplate.category}
                    onChange={(e) =>
                      setEditingTemplate({
                        ...editingTemplate,
                        category: e.target.value,
                      })
                    }
                  />
                  <Input
                    value={editingTemplate.description}
                    onChange={(e) =>
                      setEditingTemplate({
                        ...editingTemplate,
                        description: e.target.value,
                      })
                    }
                  />
                  <Textarea
                    value={editingTemplate.systemPrompt}
                    onChange={(e) =>
                      setEditingTemplate({
                        ...editingTemplate,
                        systemPrompt: e.target.value,
                      })
                    }
                    rows={3}
                  />
                  <Textarea
                    value={editingTemplate.prompt}
                    onChange={(e) =>
                      setEditingTemplate({
                        ...editingTemplate,
                        prompt: e.target.value,
                      })
                    }
                    rows={6}
                  />
                </TabsContent>

                <TabsContent
                  value="parameters"
                  className="space-y-3 sm:space-y-4 h-full overflow-y-auto"
                >
                  {editingTemplate.parameters &&
                    Object.entries(editingTemplate.parameters).map(
                      ([key, value]) => (
                        <div key={key} className="space-y-2">
                          <Label>
                            {key}: {value}
                          </Label>
                          <Slider
                            value={[value as number]}
                            onValueChange={([val]) =>
                              setEditingTemplate({
                                ...editingTemplate,
                                parameters: {
                                  ...editingTemplate.parameters,
                                  [key]: val,
                                },
                              })
                            }
                            min={key === "frequencyPenalty" ? -2 : 0}
                            max={
                              key === "maxTokens"
                                ? 4000
                                : key === "topP"
                                ? 1
                                : 2
                            }
                            step={key === "maxTokens" ? 100 : 0.1}
                          />
                        </div>
                      )
                    )}
                </TabsContent>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    editingTemplate && handleUpdateTemplate(editingTemplate)
                  }
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </Tabs>
          </DialogContent>
        )}
      </Dialog>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-muted-foreground text-sm">
            No templates found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
