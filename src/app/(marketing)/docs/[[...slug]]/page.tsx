import { notFound } from "next/navigation";
import { docs } from "#site/content";

import type { Metadata } from "next";
import Balancer from "react-wrap-balancer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { siteConfig } from "@/config/site.config";
import { absoluteUrl, cn } from "@/lib/utils";
import { MDXContentRenderer } from "@/components/mdx/mdx-content-renderer";
import { DashboardTableOfContents } from "@/components/mdx/toc";

type DocPageProps = {
    slug: string[];
};

async function getDocFromParams({ params }: { params: Promise<DocPageProps> }) {
  const parameters = await params;
  const slug = parameters.slug?.join("/") || "";
  const doc = docs.find((doc) => doc.slugAsParams === slug);

  if (!doc) {
    return null;
  }

  return doc;
}

export async function generateMetadata({
  params,
}: { params: Promise<DocPageProps> }): Promise<Metadata> {
  const doc = await getDocFromParams({ params });

  if (!doc) {
    return {};
  }

  return {
    title: `${doc.title} - ${siteConfig.name}`,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: "article",
      url: absoluteUrl(doc.slug),
      images: [
        {
          url: siteConfig.og,
          width: 2880,
          height: 1800,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: doc.title,
      description: doc.description,
      images: [siteConfig.og],
      creator: "@rds_agi",
    },
  };
}

export async function generateStaticParams(): Promise<
  { slug: string[] }[]
> {
  return docs.map((doc) => ({
    slug: doc.slugAsParams.split("/"),
  }));
}

export default async function DocPage({ params }: { params: Promise<DocPageProps> }) {
  const doc = await getDocFromParams({ params });

  if (!doc) {
    notFound();
  }

  return (
    <main className="relative p-2 md:p-4 lg:py-6 lg:px-8 lg:gap-10 xl:grid xl:grid-cols-[1fr_200px]">
      <div className="w-full mx-auto min-w-0">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            {doc.slug.split("/").map((slug, index) => (
              <div className="flex items-center gap-2" key={index}>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/${doc.slug
                      .split("/")
                      .slice(0, index + 1)
                      .join("/")}`}
                    className={cn(
                      index === doc.slug.split("/").length - 1
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {slug.charAt(0).toUpperCase() + slug.slice(1)}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < doc.slug.split("/").length - 1 && (
                  <BreadcrumbSeparator />
                )}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-2">
          <h1 className={cn("scroll-m-20 text-3xl font-bold tracking-tight")}>
            {doc.title}
          </h1>
          {doc && (
            <p className="text-base text-muted-foreground">
              <Balancer>{doc.description}</Balancer>
            </p>
          )}
        </div>
        <div className="pb-12 pt-8">
          <MDXContentRenderer code={doc.body} />
        </div>
      </div>
      <div className="hidden text-sm xl:block">
        <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] pt-4">
          {doc.toc.visible && (
            <DashboardTableOfContents toc={doc.toc.content} />
          )}
        </div>
      </div>
    </main>
  );
}
