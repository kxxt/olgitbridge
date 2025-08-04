FROM node:22-slim

WORKDIR /var/olgitbridge/
COPY . .
RUN apt-get update && apt-get upgrade -y && apt-get install --no-install-recommends git ca-certificates -y && apt-get clean
RUN npm ci
RUN git config --global user.email "overleaf-git-bridge@system.changeme.invalid" && git config --global user.name "Overleaf Git Bridge"

EXPOSE 5000
CMD [ "node", "src/server.js" ]

