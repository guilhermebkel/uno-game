FROM node:current-stretch

RUN mkdir -p /uno/packages/unapy

WORKDIR /uno/packages/unapy

COPY ./packages/unapy/package.json /uno/packages/unapy
COPY ./packages/unapy/package-lock.json /uno/packages/unapy

ENV NODE_ENV production

RUN npm ci

COPY . /uno

RUN npm run build

ENV PORT 80
EXPOSE 80 3667

CMD [ "npm", "run", "start" ]