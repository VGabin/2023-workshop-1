FROM node:16-alpine

WORKDIR /app

COPY . /app

RUN npm install 

EXPOSE 3000

ENV NAME 2023-workshop-1

CMD ["npm", "start"]