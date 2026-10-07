FROM node:24-alpine
WORKDIR /app
COPY package.json server.mjs ./
ENV PORT=3000 BIND_HOST=0.0.0.0 ROLE=web
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD node -e "fetch('http://127.0.0.1:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.mjs"]
