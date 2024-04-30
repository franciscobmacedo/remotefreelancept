# syntax=docker/dockerfile:1.2

##########################################################################
# Stage: deps
##########################################################################
FROM node:18-alpine3.19 AS deps
WORKDIR /build-stage
COPY package*.json ./

# advanced mount options for caching npm even when docker-cache is busted
RUN --mount=type=cache,target=/usr/src/app/.npm \
    : npm install and cache \
    && npm set cache /usr/src/app/.npm \
    && npm ci

COPY . ./

##########################################################################
# Stage: builder
##########################################################################
FROM deps as builder
RUN npm run build

##########################################################################
# Stage: dev
##########################################################################
FROM deps AS dev

ARG PORT=5173
ENV PORT=${PORT}

ENTRYPOINT ["/usr/local/bin/npm"]
CMD ["run", "dev"]

##########################################################################
# Stage: dev
##########################################################################
FROM deps AS test

ENV CI=1
RUN npm run vitest

##########################################################################
# Stage: final
##########################################################################

FROM nginx:1.25-alpine
COPY --from=builder /build-stage/dist /usr/share/nginx/html

