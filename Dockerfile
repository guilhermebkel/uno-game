FROM node:current-stretch

RUN mkdir -p /uno

WORKDIR /uno

COPY ./package.json /uno
COPY ./package-lock.json /uno

ENV NODE_ENV production

RUN npm i

RUN npm run bootstrap

COPY . /uno

ENV PORT 80
EXPOSE 80 3667

CMD [ "npm", "run", "unapy:dev" ]