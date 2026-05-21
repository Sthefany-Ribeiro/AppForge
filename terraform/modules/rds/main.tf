# subnet group — diz pro RDS em quais subnets ele pode ficar
resource "aws_db_subnet_group" "main" {
  name       = "${var.project}-${var.environment}-db-subnet-group"
  subnet_ids = var.private_subnets

  tags = {
    Name = "${var.project}-${var.environment}-db-subnet-group"
  }
}

# security group do banco — só aceita conexão de dentro da VPC
resource "aws_security_group" "rds" {
  name        = "${var.project}-${var.environment}-rds-sg"
  description = "Security group do RDS PostgreSQL"
  vpc_id      = var.vpc_id

  ingress {
    description = "PostgreSQL da VPC"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project}-${var.environment}-rds-sg"
  }
}

# instância RDS
resource "aws_db_instance" "main" {
  identifier        = "${var.project}-${var.environment}-db"
  engine            = "postgres"
  engine_version    = "16.4"
  instance_class    = "db.t3.micro"
  allocated_storage = 20
  storage_type      = "gp2"
  storage_encrypted = true

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  # em dev pode desligar sem snapshot pra não gerar custo
  skip_final_snapshot     = true
  deletion_protection     = false

  # backups automáticos por 7 dias
  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "Mon:04:00-Mon:05:00"

  tags = {
    Name = "${var.project}-${var.environment}-db"
  }
}