FROM node:18.14.2-slim

WORKDIR /var/olgitbridge/
COPY . .
RUN apt-get update && apt-get upgrade -y && apt-get install --no-install-recommends git ca-certificates -y && apt-get clean
RUN npm install
RUN git config --global user.email "overleaf-git-bridge@system.changeme.invalid" && git config --global user.name "Overleaf Git Bridge"

EXPOSE 5000
CMD [ "node", "src/server.js" ]

