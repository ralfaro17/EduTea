FROM mcr.microsoft.com/devcontainers/javascript-node:4-24-trixie

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts

COPY . .
EXPOSE 4173
CMD ["pnpm", "--filter", "frontend", "dev","--host", "0.0.0.0"]
