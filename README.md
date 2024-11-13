# Website TagesInsel Mölln

### Local Development

`npm i`

change `public/admin/config.yml` from

```yml
backend:
  name: github
  repo: tagesinsel-moelln/website # Path to your GitHub repository
  branch: main
  base_url: https://0cmb984hnh.execute-api.eu-central-1.amazonaws.com # your apigateway endpoint
  auth_endpoint: /prod/auth
```

to

```yml
backend:
  name: git-gateway
```

Run the local git-gatway
`npx decap-server`

Start the dev server
`npm run dev`

### Deployment

via Github Actions that run on push to main
