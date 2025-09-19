import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { 
  Menu, 
  Search, 
  User, 
  Settings, 
  Home, 
  Mail, 
  Calendar,
  FileText,
  Image,
  Play,
  Star,
  Heart,
  Share,
  Download,
  Eye
} from "lucide-react";

export function WireframeKit() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-primary rounded"></div>
              <h1>Wireframe Kit</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
              <Button size="sm">Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="mb-2">Professional Wireframe Components</h2>
          <p className="text-muted-foreground">
            Ready-to-use wireframe components for rapid prototyping and design planning
          </p>
        </div>

        <Tabs defaultValue="headers" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="sidebar">Sidebar</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
            <TabsTrigger value="layouts">Layouts</TabsTrigger>
          </TabsList>

          {/* Headers Tab */}
          <TabsContent value="headers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Header Wireframe 1 - Simple Navigation */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Header - Simple Nav</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="w-24 h-6 bg-primary/20 rounded"></div>
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-4 bg-muted rounded"></div>
                      <div className="w-16 h-4 bg-muted rounded"></div>
                      <div className="w-14 h-4 bg-muted rounded"></div>
                    </div>
                    <div className="w-20 h-8 bg-primary/20 rounded"></div>
                  </div>
                </div>
              </Card>

              {/* Header Wireframe 2 - With Search */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Header - With Search</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-center justify-between gap-4">
                    <div className="w-24 h-6 bg-primary/20 rounded"></div>
                    <div className="flex-1 h-8 bg-muted rounded-full"></div>
                    <div className="flex items-center gap-3">
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Header Wireframe 3 - Mobile Menu */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Header - Mobile Menu</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <Menu className="w-5 h-5 text-muted-foreground" />
                    <div className="w-24 h-6 bg-primary/20 rounded"></div>
                    <div className="w-8 h-8 bg-muted rounded-full"></div>
                  </div>
                </div>
              </Card>

              {/* Header Wireframe 4 - With Breadcrumbs */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Header - With Breadcrumbs</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-24 h-6 bg-primary/20 rounded"></div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-4 bg-muted rounded"></div>
                      <div className="w-16 h-4 bg-muted rounded"></div>
                      <div className="w-20 h-8 bg-primary/20 rounded"></div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-3 bg-muted rounded"></div>
                    <span className="text-muted-foreground">/</span>
                    <div className="w-12 h-3 bg-muted rounded"></div>
                    <span className="text-muted-foreground">/</span>
                    <div className="w-16 h-3 bg-primary/20 rounded"></div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Hero Sections Tab */}
          <TabsContent value="hero" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hero Wireframe 1 - Centered */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Hero - Centered</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-8 bg-muted/30">
                  <div className="text-center space-y-4">
                    <div className="w-3/4 h-8 bg-primary/20 rounded mx-auto"></div>
                    <div className="w-full h-4 bg-muted rounded"></div>
                    <div className="w-2/3 h-4 bg-muted rounded mx-auto"></div>
                    <div className="flex items-center justify-center gap-3 mt-6">
                      <div className="w-24 h-10 bg-primary/20 rounded"></div>
                      <div className="w-24 h-10 bg-muted rounded"></div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Hero Wireframe 2 - Split Layout */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Hero - Split Layout</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-6 bg-muted/30">
                  <div className="grid grid-cols-2 gap-6 items-center">
                    <div className="space-y-4">
                      <div className="w-full h-6 bg-primary/20 rounded"></div>
                      <div className="w-full h-3 bg-muted rounded"></div>
                      <div className="w-3/4 h-3 bg-muted rounded"></div>
                      <div className="w-20 h-8 bg-primary/20 rounded mt-4"></div>
                    </div>
                    <div className="w-full h-32 bg-muted rounded"></div>
                  </div>
                </div>
              </Card>

              {/* Hero Wireframe 3 - Video Background */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Hero - Video Background</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-8 bg-muted/30 relative">
                  <div className="absolute top-2 right-2">
                    <Play className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="text-center space-y-4">
                    <div className="w-2/3 h-6 bg-background/80 rounded mx-auto"></div>
                    <div className="w-1/2 h-3 bg-background/60 rounded mx-auto"></div>
                    <div className="w-20 h-8 bg-background/80 rounded mx-auto mt-4"></div>
                  </div>
                </div>
              </Card>

              {/* Hero Wireframe 4 - Feature Grid */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Hero - Feature Grid</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-6 bg-muted/30">
                  <div className="text-center mb-6">
                    <div className="w-2/3 h-6 bg-primary/20 rounded mx-auto mb-2"></div>
                    <div className="w-1/2 h-3 bg-muted rounded mx-auto"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="text-center space-y-2">
                        <div className="w-8 h-8 bg-primary/20 rounded mx-auto"></div>
                        <div className="w-full h-3 bg-muted rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Forms Tab */}
          <TabsContent value="forms" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form Wireframe 1 - Contact Form */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Form - Contact</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-6 bg-muted/30">
                  <div className="space-y-4">
                    <div className="w-32 h-5 bg-primary/20 rounded"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="w-16 h-3 bg-muted rounded"></div>
                        <div className="w-full h-8 bg-background border rounded"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="w-16 h-3 bg-muted rounded"></div>
                        <div className="w-full h-8 bg-background border rounded"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-12 h-3 bg-muted rounded"></div>
                      <div className="w-full h-8 bg-background border rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-16 h-3 bg-muted rounded"></div>
                      <div className="w-full h-20 bg-background border rounded"></div>
                    </div>
                    <div className="w-24 h-8 bg-primary/20 rounded"></div>
                  </div>
                </div>
              </Card>

              {/* Form Wireframe 2 - Login Form */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Form - Login</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-6 bg-muted/30">
                  <div className="max-w-sm mx-auto space-y-4">
                    <div className="w-16 h-6 bg-primary/20 rounded mx-auto"></div>
                    <div className="space-y-2">
                      <div className="w-12 h-3 bg-muted rounded"></div>
                      <div className="w-full h-8 bg-background border rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-16 h-3 bg-muted rounded"></div>
                      <div className="w-full h-8 bg-background border rounded"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-muted rounded-sm"></div>
                        <div className="w-20 h-3 bg-muted rounded"></div>
                      </div>
                      <div className="w-24 h-3 bg-primary/20 rounded"></div>
                    </div>
                    <div className="w-full h-8 bg-primary/20 rounded"></div>
                  </div>
                </div>
              </Card>

              {/* Form Wireframe 3 - Registration Form */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Form - Registration</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-6 bg-muted/30">
                  <div className="space-y-4">
                    <div className="w-24 h-5 bg-primary/20 rounded"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="w-16 h-3 bg-muted rounded"></div>
                        <div className="w-full h-8 bg-background border rounded"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="w-16 h-3 bg-muted rounded"></div>
                        <div className="w-full h-8 bg-background border rounded"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-12 h-3 bg-muted rounded"></div>
                      <div className="w-full h-8 bg-background border rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-16 h-3 bg-muted rounded"></div>
                      <div className="w-full h-8 bg-background border rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-24 h-3 bg-muted rounded"></div>
                      <div className="w-full h-8 bg-background border rounded"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-muted rounded-sm"></div>
                      <div className="w-32 h-3 bg-muted rounded"></div>
                    </div>
                    <div className="w-full h-8 bg-primary/20 rounded"></div>
                  </div>
                </div>
              </Card>

              {/* Form Wireframe 4 - Search Form */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Form - Search</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-6 bg-muted/30">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <div className="flex-1 h-10 bg-background border rounded-l"></div>
                      <div className="w-20 h-10 bg-primary/20 rounded-r flex items-center justify-center">
                        <Search className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="w-16 h-6 bg-muted rounded-full"></div>
                      <div className="w-20 h-6 bg-muted rounded-full"></div>
                      <div className="w-14 h-6 bg-muted rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="w-16 h-3 bg-muted rounded"></div>
                        <div className="w-full h-8 bg-background border rounded"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="w-20 h-3 bg-muted rounded"></div>
                        <div className="w-full h-8 bg-background border rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Cards Tab */}
          <TabsContent value="cards" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card Wireframe 1 - Product Card */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Card - Product</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="space-y-3">
                    <div className="w-full h-32 bg-muted rounded"></div>
                    <div className="space-y-2">
                      <div className="w-3/4 h-4 bg-primary/20 rounded"></div>
                      <div className="w-full h-3 bg-muted rounded"></div>
                      <div className="w-2/3 h-3 bg-muted rounded"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="w-16 h-5 bg-primary/20 rounded"></div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-3 h-3 text-muted-foreground" />
                        ))}
                      </div>
                    </div>
                    <div className="w-full h-8 bg-primary/20 rounded"></div>
                  </div>
                </div>
              </Card>

              {/* Card Wireframe 2 - Profile Card */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Card - Profile</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-muted rounded-full mx-auto"></div>
                    <div>
                      <div className="w-24 h-4 bg-primary/20 rounded mx-auto"></div>
                      <div className="w-32 h-3 bg-muted rounded mx-auto mt-1"></div>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-center">
                        <div className="w-8 h-4 bg-primary/20 rounded mx-auto"></div>
                        <div className="w-12 h-3 bg-muted rounded mx-auto mt-1"></div>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-4 bg-primary/20 rounded mx-auto"></div>
                        <div className="w-16 h-3 bg-muted rounded mx-auto mt-1"></div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 h-8 bg-primary/20 rounded"></div>
                      <div className="flex-1 h-8 bg-muted rounded"></div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Card Wireframe 3 - Article Card */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Card - Article</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-muted rounded-full"></div>
                      <div className="w-20 h-3 bg-muted rounded"></div>
                      <div className="w-16 h-3 bg-muted rounded"></div>
                    </div>
                    <div className="w-full h-24 bg-muted rounded"></div>
                    <div>
                      <div className="w-3/4 h-4 bg-primary/20 rounded"></div>
                      <div className="w-full h-3 bg-muted rounded mt-2"></div>
                      <div className="w-2/3 h-3 bg-muted rounded mt-1"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="w-20 h-3 bg-muted rounded"></div>
                      <div className="flex gap-2">
                        <Heart className="w-4 h-4 text-muted-foreground" />
                        <Share className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Card Wireframe 4 - Stats Card */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Card - Statistics</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-24 h-4 bg-primary/20 rounded"></div>
                      <div className="w-4 h-4 bg-muted rounded"></div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-8 bg-primary/20 rounded mx-auto"></div>
                      <div className="w-20 h-3 bg-muted rounded mx-auto mt-2"></div>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full">
                      <div className="w-3/4 h-2 bg-primary/20 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="w-16 h-3 bg-muted rounded"></div>
                      <div className="w-12 h-3 bg-green-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Sidebar Tab */}
          <TabsContent value="sidebar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sidebar Wireframe 1 - Navigation */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Sidebar - Navigation</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex">
                    <div className="w-16 border-r bg-background/50 p-3 space-y-3">
                      <div className="w-6 h-6 bg-primary/20 rounded mx-auto"></div>
                      <div className="space-y-2">
                        <Home className="w-4 h-4 text-muted-foreground mx-auto" />
                        <Mail className="w-4 h-4 text-muted-foreground mx-auto" />
                        <Calendar className="w-4 h-4 text-muted-foreground mx-auto" />
                        <FileText className="w-4 h-4 text-muted-foreground mx-auto" />
                        <Settings className="w-4 h-4 text-muted-foreground mx-auto" />
                      </div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="w-32 h-4 bg-primary/20 rounded mb-3"></div>
                      <div className="space-y-2">
                        <div className="w-full h-3 bg-muted rounded"></div>
                        <div className="w-3/4 h-3 bg-muted rounded"></div>
                        <div className="w-5/6 h-3 bg-muted rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Sidebar Wireframe 2 - Expanded Navigation */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Sidebar - Expanded</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex">
                    <div className="w-48 border-r bg-background/50 p-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary/20 rounded"></div>
                        <div className="w-20 h-4 bg-primary/20 rounded"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Home className="w-4 h-4 text-muted-foreground" />
                          <div className="w-16 h-3 bg-muted rounded"></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <div className="w-20 h-3 bg-muted rounded"></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div className="w-18 h-3 bg-muted rounded"></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <div className="w-16 h-3 bg-muted rounded"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="w-32 h-4 bg-primary/20 rounded mb-3"></div>
                      <div className="space-y-2">
                        <div className="w-full h-3 bg-muted rounded"></div>
                        <div className="w-3/4 h-3 bg-muted rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Sidebar Wireframe 3 - Filter Sidebar */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Sidebar - Filters</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex">
                    <div className="w-48 border-r bg-background/50 p-4 space-y-4">
                      <div className="w-16 h-4 bg-primary/20 rounded"></div>
                      <div className="space-y-3">
                        <div>
                          <div className="w-20 h-3 bg-muted rounded mb-2"></div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-muted rounded-sm"></div>
                              <div className="w-16 h-3 bg-muted rounded"></div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-muted rounded-sm"></div>
                              <div className="w-20 h-3 bg-muted rounded"></div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="w-16 h-3 bg-muted rounded mb-2"></div>
                          <div className="w-full h-2 bg-muted rounded-full">
                            <div className="w-1/2 h-2 bg-primary/20 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="border rounded p-2">
                            <div className="w-full h-16 bg-muted rounded mb-2"></div>
                            <div className="w-3/4 h-3 bg-muted rounded"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Sidebar Wireframe 4 - Chat Sidebar */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Sidebar - Chat</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex">
                    <div className="w-56 border-r bg-background/50 p-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-4 bg-primary/20 rounded"></div>
                        <div className="w-4 h-4 bg-muted rounded"></div>
                      </div>
                      <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex items-center gap-2 p-2 rounded">
                            <div className="w-6 h-6 bg-muted rounded-full"></div>
                            <div className="flex-1">
                              <div className="w-16 h-3 bg-muted rounded mb-1"></div>
                              <div className="w-20 h-2 bg-muted rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <div className="w-6 h-6 bg-muted rounded-full"></div>
                          <div className="flex-1 space-y-1">
                            <div className="w-3/4 h-3 bg-muted rounded"></div>
                            <div className="w-1/2 h-3 bg-muted rounded"></div>
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <div className="flex-1 max-w-xs space-y-1 text-right">
                            <div className="w-2/3 h-3 bg-primary/20 rounded ml-auto"></div>
                            <div className="w-1/2 h-3 bg-primary/20 rounded ml-auto"></div>
                          </div>
                          <div className="w-6 h-6 bg-primary/20 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Footer Tab */}
          <TabsContent value="footer" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Footer Wireframe 1 - Simple Footer */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Footer - Simple</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="text-center space-y-3">
                    <div className="flex justify-center gap-4">
                      <div className="w-12 h-3 bg-muted rounded"></div>
                      <div className="w-16 h-3 bg-muted rounded"></div>
                      <div className="w-14 h-3 bg-muted rounded"></div>
                      <div className="w-18 h-3 bg-muted rounded"></div>
                    </div>
                    <Separator />
                    <div className="w-32 h-3 bg-muted rounded mx-auto"></div>
                  </div>
                </div>
              </Card>

              {/* Footer Wireframe 2 - Column Footer */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Footer - Columns</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="w-16 h-3 bg-primary/20 rounded"></div>
                        <div className="space-y-1">
                          <div className="w-12 h-2 bg-muted rounded"></div>
                          <div className="w-14 h-2 bg-muted rounded"></div>
                          <div className="w-10 h-2 bg-muted rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center mt-4">
                    <div className="w-32 h-3 bg-muted rounded"></div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-4 h-4 bg-muted rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Footer Wireframe 3 - Newsletter Footer */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Footer - Newsletter</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-32 h-4 bg-primary/20 rounded mx-auto mb-2"></div>
                      <div className="w-48 h-3 bg-muted rounded mx-auto"></div>
                    </div>
                    <div className="flex gap-2 max-w-sm mx-auto">
                      <div className="flex-1 h-8 bg-background border rounded"></div>
                      <div className="w-20 h-8 bg-primary/20 rounded"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="w-16 h-3 bg-primary/20 rounded"></div>
                        <div className="space-y-1">
                          <div className="w-12 h-2 bg-muted rounded"></div>
                          <div className="w-14 h-2 bg-muted rounded"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="w-20 h-3 bg-primary/20 rounded"></div>
                        <div className="space-y-1">
                          <div className="w-16 h-2 bg-muted rounded"></div>
                          <div className="w-12 h-2 bg-muted rounded"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="w-18 h-3 bg-primary/20 rounded"></div>
                        <div className="space-y-1">
                          <div className="w-14 h-2 bg-muted rounded"></div>
                          <div className="w-16 h-2 bg-muted rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Footer Wireframe 4 - Contact Footer */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Footer - Contact</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="w-24 h-6 bg-primary/20 rounded"></div>
                      <div className="space-y-2">
                        <div className="w-full h-3 bg-muted rounded"></div>
                        <div className="w-3/4 h-3 bg-muted rounded"></div>
                      </div>
                      <div className="space-y-1">
                        <div className="w-32 h-3 bg-muted rounded"></div>
                        <div className="w-28 h-3 bg-muted rounded"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="w-20 h-4 bg-primary/20 rounded"></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="w-12 h-2 bg-muted rounded"></div>
                          <div className="w-16 h-2 bg-muted rounded"></div>
                          <div className="w-14 h-2 bg-muted rounded"></div>
                        </div>
                        <div className="space-y-1">
                          <div className="w-16 h-2 bg-muted rounded"></div>
                          <div className="w-12 h-2 bg-muted rounded"></div>
                          <div className="w-18 h-2 bg-muted rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Layouts Tab */}
          <TabsContent value="layouts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Layout Wireframe 1 - Dashboard */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Layout - Dashboard</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-3 bg-muted/30">
                  <div className="space-y-2">
                    {/* Header */}
                    <div className="w-full h-6 bg-background border rounded"></div>
                    <div className="flex gap-2">
                      {/* Sidebar */}
                      <div className="w-12 bg-background border rounded p-1">
                        <div className="space-y-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-2 h-2 bg-muted rounded mx-auto"></div>
                          ))}
                        </div>
                      </div>
                      {/* Main Content */}
                      <div className="flex-1 space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="h-8 bg-background border rounded"></div>
                          ))}
                        </div>
                        <div className="h-16 bg-background border rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Layout Wireframe 2 - Blog */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Layout - Blog</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-3 bg-muted/30">
                  <div className="space-y-2">
                    {/* Header */}
                    <div className="w-full h-6 bg-background border rounded"></div>
                    <div className="flex gap-2">
                      {/* Main Content */}
                      <div className="flex-1 space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-12 bg-background border rounded"></div>
                        ))}
                      </div>
                      {/* Sidebar */}
                      <div className="w-16 bg-background border rounded p-1">
                        <div className="space-y-1">
                          <div className="w-full h-3 bg-primary/20 rounded"></div>
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="w-full h-2 bg-muted rounded"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Layout Wireframe 3 - E-commerce */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Layout - E-commerce</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-3 bg-muted/30">
                  <div className="space-y-2">
                    {/* Header */}
                    <div className="w-full h-6 bg-background border rounded"></div>
                    <div className="flex gap-2">
                      {/* Filters */}
                      <div className="w-12 bg-background border rounded p-1">
                        <div className="space-y-1">
                          <div className="w-full h-2 bg-primary/20 rounded"></div>
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="w-full h-1 bg-muted rounded"></div>
                          ))}
                        </div>
                      </div>
                      {/* Products Grid */}
                      <div className="flex-1">
                        <div className="grid grid-cols-4 gap-1">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="h-8 bg-background border rounded"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Layout Wireframe 4 - Landing Page */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">Layout - Landing Page</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="border rounded-lg p-3 bg-muted/30">
                  <div className="space-y-2">
                    {/* Header */}
                    <div className="w-full h-4 bg-background border rounded"></div>
                    {/* Hero */}
                    <div className="w-full h-12 bg-primary/20 border rounded"></div>
                    {/* Features */}
                    <div className="grid grid-cols-3 gap-1">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-6 bg-background border rounded"></div>
                      ))}
                    </div>
                    {/* Content */}
                    <div className="w-full h-8 bg-background border rounded"></div>
                    {/* Footer */}
                    <div className="w-full h-4 bg-background border rounded"></div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}