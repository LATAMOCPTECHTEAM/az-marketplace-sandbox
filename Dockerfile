FROM node:12.16.3-alpine3.11 as final
ENV NODE_ENV=production
EXPOSE 80

FROM node:12 as base
ENV NODE_ENV=development 
RUN npm install typescript -g

# Building Web ReactJS
FROM base as build-web
WORKDIR /build

COPY ./web/package.json package.json
RUN npm install

COPY ./web .
RUN npm run-script build

# Building API
FROM base as build-api
WORKDIR /build

COPY ./api/package.json package.json
COPY ./api/package-lock.json package-lock.json

RUN npm install

COPY ./api .
RUN npm run-script compile

# Merging Build
FROM final

WORKDIR /app

COPY --from=build-api /build/bin bin/.
COPY --from=build-api /build/package.json .
COPY --from=build-api /build/package-lock.json .
COPY --from=build-web /build/build bin/public

RUN npm install

ENTRYPOINT [ "npm" , "start"]