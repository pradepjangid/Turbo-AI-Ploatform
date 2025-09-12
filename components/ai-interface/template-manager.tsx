"use client";

import { useState } from "react";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useAI } from "@/contexts/ai-context";
import type { PromptTemplate } from "@/app/api/templates/route";
import { Plus, Edit, Trash2, Save } from "lucide-react";

export function TemplateManager() {
  const { state, loadTemplate } = useAI();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(
    null
  );
  const [newTemplate, setNewTemplate] = useState<Partial<PromptTemplate>>({
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
  });

  const categories = [
    "all",
    ...new Set(state.templates.map((t) => t.category)),
  ];

  const filteredTemplates = state.templates.filter((template) => {
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

  const handleSaveTemplate = async () => {
    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTemplate),
      });

      if (response.ok) {
        setIsCreateDialogOpen(false);
        setNewTemplate({
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
        });
        // Refresh templates list
        window.location.reload();
      }
    } catch (error) {
      console.error("[v0] Failed to save template:", error);
    }
  };

  const handleUpdateTemplate = async (template: PromptTemplate) => {
    try {
      const response = await fetch(`/api/templates?id=${template.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(template),
      });

      if (response.ok) {
        setEditingTemplate(null);
        // Refresh templates list
        window.location.reload();
      }
    } catch (error) {
      console.error("[v0] Failed to update template:", error);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/templates?id=${templateId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh templates list
        window.location.reload();
      }
    } catch (error) {
      console.error("[v0] Failed to delete template:", error);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 text-sm"
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
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-2xl h-[90vh] max-h-[90vh] sm:h-[80vh] sm:max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">
                Create New Template
              </DialogTitle>
              <DialogDescription className="text-sm">
                Create a reusable prompt template with custom parameters
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="basic" className="w-full flex-1 min-h-0">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic" className="text-sm">
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="parameters" className="text-sm">
                  Parameters
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 min-h-0 overflow-auto">
                <TabsContent
                  value="basic"
                  className="space-y-3 sm:space-y-4 h-full overflow-y-auto"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm">
                        Template Name
                      </Label>
                      <Input
                        id="name"
                        value={newTemplate.name}
                        onChange={(e) =>
                          setNewTemplate((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Enter template name"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm">
                        Category
                      </Label>
                      <Input
                        id="category"
                        value={newTemplate.category}
                        onChange={(e) =>
                          setNewTemplate((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        placeholder="Enter category"
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm">
                      Description
                    </Label>
                    <Input
                      id="description"
                      value={newTemplate.description}
                      onChange={(e) =>
                        setNewTemplate((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Brief description of the template"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="system-prompt" className="text-sm">
                      System Prompt (Optional)
                    </Label>
                    <Textarea
                      id="system-prompt"
                      value={newTemplate.systemPrompt}
                      onChange={(e) =>
                        setNewTemplate((prev) => ({
                          ...prev,
                          systemPrompt: e.target.value,
                        }))
                      }
                      placeholder="System instructions for the AI"
                      rows={3}
                      className="text-sm resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prompt" className="text-sm">
                      Main Prompt
                    </Label>
                    <Textarea
                      id="prompt"
                      value={newTemplate.prompt}
                      onChange={(e) =>
                        setNewTemplate((prev) => ({
                          ...prev,
                          prompt: e.target.value,
                        }))
                      }
                      placeholder="Enter your prompt template (use {variable} for placeholders)"
                      rows={6}
                      className="text-sm resize-none"
                    />
                  </div>
                </TabsContent>

                <TabsContent
                  value="parameters"
                  className="space-y-3 sm:space-y-4 h-full overflow-y-auto"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm">
                        Temperature: {newTemplate.parameters?.temperature}
                      </Label>
                      <Slider
                        value={[newTemplate.parameters?.temperature || 0.7]}
                        onValueChange={([value]) =>
                          setNewTemplate((prev) => ({
                            ...prev,
                            parameters: {
                              ...prev.parameters!,
                              temperature: value,
                            },
                          }))
                        }
                        max={2}
                        min={0}
                        step={0.1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">
                        Max Tokens: {newTemplate.parameters?.maxTokens}
                      </Label>
                      <Slider
                        value={[newTemplate.parameters?.maxTokens || 1000]}
                        onValueChange={([value]) =>
                          setNewTemplate((prev) => ({
                            ...prev,
                            parameters: {
                              ...prev.parameters!,
                              maxTokens: value,
                            },
                          }))
                        }
                        max={4000}
                        min={100}
                        step={100}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">
                        Top P: {newTemplate.parameters?.topP}
                      </Label>
                      <Slider
                        value={[newTemplate.parameters?.topP || 1.0]}
                        onValueChange={([value]) =>
                          setNewTemplate((prev) => ({
                            ...prev,
                            parameters: { ...prev.parameters!, topP: value },
                          }))
                        }
                        max={1}
                        min={0}
                        step={0.1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">
                        Frequency Penalty:{" "}
                        {newTemplate.parameters?.frequencyPenalty}
                      </Label>
                      <Slider
                        value={[
                          newTemplate.parameters?.frequencyPenalty || 0.0,
                        ]}
                        onValueChange={([value]) =>
                          setNewTemplate((prev) => ({
                            ...prev,
                            parameters: {
                              ...prev.parameters!,
                              frequencyPenalty: value,
                            },
                          }))
                        }
                        max={2}
                        min={-2}
                        step={0.1}
                      />
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveTemplate} className="w-full sm:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-start justify-between">
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
                    onClick={() => setEditingTemplate(template)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
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
                onClick={() => loadTemplate(template)}
              >
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

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
