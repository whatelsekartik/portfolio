const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isUserPagesSite = repoName.endsWith('.github.io');
const shouldUseBasePath = Boolean(process.env.GITHUB_ACTIONS) && repoName && !isUserPagesSite;
const basePath = shouldUseBasePath ? `/${repoName}` : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath,
  assetPrefix: basePath || undefined
};

export default nextConfig;
