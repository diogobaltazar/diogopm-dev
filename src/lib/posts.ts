import type { ComponentType } from 'react'

interface Frontmatter {
  title: string
  date: string
  description: string
}

interface PostModule {
  default: ComponentType
  frontmatter: Frontmatter
}

export interface Post {
  slug: string
  frontmatter: Frontmatter
  Component: ComponentType
}

const modules = import.meta.glob<PostModule>('../posts/*.mdx', { eager: true })

export const posts: Post[] = Object.entries(modules)
  .map(([path, mod]) => ({
    slug: path.replace('../posts/', '').replace('.mdx', ''),
    frontmatter: mod.frontmatter,
    Component: mod.default,
  }))
  .sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime(),
  )

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}
