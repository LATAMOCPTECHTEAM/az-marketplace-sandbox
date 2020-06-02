FROM node:12 as build
 
# Building Application
WORKDIR /build
ENV NODE_ENV=development 
COPY package.json package.json
RUN npm install typescript -g
RUN npm install

COPY . .

RUN npm run-script compile

# ---
FROM node:12.16.3-alpine3.11

WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /build/bin bin/.
COPY --from=build /build/package.json .
COPY --from=build /build/package-lock.json .

RUN npm install

ENTRYPOINT [ "npm" , "start"]