variable "aws_region" {
  description = "Região AWS onde os recursos serão criados"
  type        = string
  default     = "us-west-2"
}

variable "project" {
  description = "Nome do projeto — usado nos nomes dos recursos e tags"
  type        = string
  default     = "appforge"
}

variable "environment" {
  description = "Ambiente de deploy"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment deve ser dev, staging ou prod."
  }
}

variable "vpc_cidr" {
  description = "CIDR block da VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "cluster_version" {
  description = "Versão do Kubernetes no EKS"
  type        = string
  default     = "1.29"
}

variable "node_instance_type" {
  description = "Tipo de instância dos nodes do EKS"
  type        = string
  default     = "t3.medium"
}

variable "db_name" {
  description = "Nome do banco de dados"
  type        = string
  default     = "appforge"
}

variable "db_username" {
  description = "Usuário do banco de dados"
  type        = string
  default     = "appforge"
}

variable "db_password" {
  description = "Senha do banco de dados — nunca coloque o valor aqui, use tfvars ou variável de ambiente"
  type        = string
  sensitive   = true
}