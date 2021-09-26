FROM node:16-alpine

# Do package things
RUN mkdir -p /usr/src/app/patches
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app/
COPY ./package-lock.json /usr/src/app/
COPY ./patches/* /usr/src/app/patches
RUN npm install

# Actually load and run some code
COPY ./ /usr/src/app/
ENV NODE_ENV production
RUN npm run build
ENV PORT 80
EXPOSE 80
CMD [ "npm", "start" ]
