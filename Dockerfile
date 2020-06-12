# Building Web ReactJS
FROM node:12 as build-web
 
# Building Application
WORKDIR /build
ENV NODE_ENV=development 

COPY ./web/package.json package.json

RUN npm install typescript -g
RUN npm install

COPY ./web .

RUN npm run-script build

# Building API
FROM node:12 as build-api
 
# Building Application
WORKDIR /build
ENV NODE_ENV=development 

COPY ./api/package.json package.json
RUN npm install typescript -g
RUN npm install

COPY ./api .

RUN npm run-script compile

# Merging Build
FROM node:12.16.3-alpine3.11
ENV NODE_ENV=production

WORKDIR /app

COPY --from=build-api /build/bin bin/.
COPY --from=build-api /build/package.json .
COPY --from=build-api /build/package-lock.json .
COPY --from=build-web /build/build bin/public

RUN npm install

ENTRYPOINT [ "npm" , "start"]