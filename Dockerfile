FROM cypress/included:12.17.4

WORKDIR /e2e

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

CMD ["npx", "cypress", "run", "--browser", "chrome"]