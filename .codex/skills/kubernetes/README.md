# ☸️ Kubernetes Specialist

**Skill para criar manifests Kubernetes** com estrutura `infra/k8s/` seguindo o padrão da empresa (Kustomize).

## Para que serve?

Esta skill instrui o agente a criar a estrutura completa de manifests Kubernetes para projetos, com suporte a ambientes de **development** e **production** usando Kustomize como base de customização.

## Estrutura Gerada

```
infra/k8s/
├── base/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── kustomization.yaml
├── development/
│   ├── configmap.yaml
│   ├── hpa.yaml
│   ├── ingress.yaml
│   └── kustomization.yaml
└── production/
    ├── configmap.yaml
    ├── hpa.yaml
    ├── ingress.yaml
    └── kustomization.yaml
```

## Recursos Incluídos

| Recurso | Base | Dev | Prod |
|---------|------|-----|------|
| **Deployment** | ✅ (RollingUpdate, probes, resources) | — | — |
| **Service** | ✅ (NodePort) | — | — |
| **ConfigMap** | — | ✅ | ✅ |
| **HPA** | — | ✅ (1 réplica) | ✅ (3-6 réplicas) |
| **Ingress** | — | ✅ (público) | ✅ (público + privado) |

## Fluxo de Uso

1. Agente coleta: nome do projeto, namespace, portas, health check, hosts de ingress
2. Cria a estrutura completa com todos os manifests
3. Inclui TODOs para guiar configurações específicas

## Quando usar?

- Ao iniciar um novo projeto que será deployado em Kubernetes
- No workflow `/init-project` como um dos passos de inicialização
