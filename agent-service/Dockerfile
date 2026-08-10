FROM node:24-slim AS build

WORKDIR /service
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:24-slim AS runtime

ENV NODE_ENV=production
WORKDIR /service
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /service/dist ./dist

USER node
EXPOSE 8080
CMD ["npm", "start"]
