FROM node:latest
WORKDIR /webapp.runtime
RUN chown -R node /webapp.runtime
COPY package*.json ./
COPY ./index.html ./
COPY ./fastify ./fastify
COPY ./assets ./assets
COPY ./externals ./externals
COPY ./index ./index
COPY ./https ./https
COPY ./pwa ./pwa
RUN npm install --include=dev
RUN npm ci
COPY . ./
#RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
