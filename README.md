# AppForge

API REST containerizada com pipeline completo de CI/CD na AWS.

## Stack

- **App**: Node.js + Express + PostgreSQL
- **Container**: Docker + Docker Compose
- **Orquestração**: Kubernetes (EKS)
- **IaC**: Terraform
- **CI/CD**: GitHub Actions
- **Cloud**: AWS (ECR, EKS, RDS, ALB)

## Arquitetura

Internet → ALB → Ingress → Service → Pods (EKS)
↓
RDS PostgreSQL

## Estrutura

appforge/
├── app/                    # aplicação Node.js
│   ├── Dockerfile          # multi-stage build
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── db.js
│       └── routes/
│           ├── health.js   # liveness e readiness probes
│           └── tasks.js    # CRUD de tarefas
├── k8s/                    # manifestos Kubernetes
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── hpa.yaml
├── terraform/              # infraestrutura como código
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── modules/
│       ├── vpc/            # rede, subnets, NAT gateway
│       ├── eks/            # cluster Kubernetes + ECR
│       └── rds/            # PostgreSQL gerenciado
├── .github/
│   └── workflows/
│       └── ci-cd.yaml      # pipeline completo
└── docker-compose.yml      # ambiente de desenvolvimento local

## Como rodar local

```bash
git clone https://github.com/seu-user/appforge.git
cd appforge

docker compose up --build
```

Endpoints disponíveis:

| Método | Rota         | Descrição              |
|--------|-------------|------------------------|
| GET    | /healthz    | liveness probe         |
| GET    | /readyz     | readiness probe        |
| GET    | /tasks      | lista todas as tarefas |
| POST   | /tasks      | cria uma tarefa        |
| PATCH  | /tasks/:id  | atualiza uma tarefa    |
| DELETE | /tasks/:id  | remove uma tarefa      |

## Infraestrutura

### Pré-requisitos

- AWS CLI configurado
- Terraform >= 1.6.0
- kubectl

### Antes do primeiro apply

Cria o bucket S3 e a tabela DynamoDB para o state remoto:

```bash
aws s3api create-bucket \
  --bucket appforge-tfstate-SEUNOME \
  --region us-east-1

aws dynamodb create-table \
  --table-name appforge-tfstate-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### Deploy da infraestrutura

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

### Configurar kubectl

```bash
aws eks update-kubeconfig \
  --name appforge-dev \
  --region us-east-1
```

## CI/CD

O pipeline roda automaticamente em todo push para a branch `main`:

1. **Test** — lint e testes unitários
2. **Build** — docker build e push para o ECR
3. **Deploy** — kubectl apply dos manifestos no EKS

## Decisões técnicas

**Multi-stage Dockerfile** — imagem de produção sem devDependencies, rodando com usuário não-root.

**Terraform modules** — cada camada de infraestrutura isolada em módulo próprio, facilitando reuso e manutenção.

**State remoto com lock** — S3 + DynamoDB garante que deploys concorrentes não corrompam o state.

**HPA com behavior** — autoscaling conservador no scale down evita flapping em tráfego instável.

**Zero downtime deploy** — RollingUpdate com maxUnavailable: 0 garante disponibilidade durante deploys.