import ThemeToggler from "@/components/theme/toggler";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookText, Github } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";

export default function Home() {
  return (
    <main className="w-full flex flex-col min-h-screen max-w-7xl mx-auto">
      <div className="flex-1 flex flex-col items-center mt-12 md:mt-24 lg:mt-32 gap-8 px-4">
        <div className="max-w-3xl text-center space-y-6">
          <h2 className="text-3xl sm:text-6xl tracking-tight font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent py-2">
            {siteConfig.title}
          </h2>
          <p className="text-base md:text-xl text-muted-foreground">
            {siteConfig.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
          <Button size="lg" className="w-full" asChild>
            <Link href="/docs" className="gap-2">
              <BookText size={20} />
              View Documentation
              <ArrowRight size={16} className="ml-auto" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full" asChild>
            <Link href={siteConfig.socials.github} className="gap-2" target="_blank">
              <Github size={20} />
              Get Template
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
          <div className="p-6 rounded-lg border bg-card text-card-foreground">
            <h3 className="font-semibold mb-2">MDX Support</h3>
            <p className="text-sm text-muted-foreground">Write content in MDX with full support for React components</p>
          </div>
          <div className="p-6 rounded-lg border bg-card text-card-foreground">
            <h3 className="font-semibold mb-2">Velite Integration</h3>
            <p className="text-sm text-muted-foreground">Efficient content management and processing with Velite</p>
          </div>
          <div className="p-6 rounded-lg border bg-card text-card-foreground">
            <h3 className="font-semibold mb-2">Shadcn UI</h3>
            <p className="text-sm text-muted-foreground">Beautiful and customizable components out of the box</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4">
        <ThemeToggler />
      </div>
      <footer className="py-4 md:py-8 text-sm text-center text-muted-foreground">
        <p>Created by <a href={siteConfig.creator.url} target="_blank" className="underline hover:no-underline">{siteConfig.creator.name}</a></p>
      </footer>
    </main>
  )
}
