# Evolution of Todo - Phase V Specification

**Version:** 5.0.0
**Date:** 2025-12-31
**Status:** Ready for Implementation
**Governed By:** CONSTITUTION.md v1.0.0
**Extends:** All previous phases (I-IV)

---

## Table of Contents
1. [Overview](#overview)
2. [Cloud-Native Architecture](#cloud-native-architecture)
3. [DigitalOcean Kubernetes (DOKS) Deployment](#digitalocean-kubernetes-doks-deployment)
4. [Event-Driven Design](#event-driven-design)
5. [Dapr Integration](#dapr-integration)
6. [Apache Kafka Specification](#apache-kafka-specification)
7. [Observability Stack](#observability-stack)
8. [AIOps Implementation](#aiops-implementation)
9. [Production Readiness](#production-readiness)
10. [High Availability & Disaster Recovery](#high-availability--disaster-recovery)
11. [Security & Compliance](#security--compliance)
12. [Acceptance Criteria](#acceptance-criteria)

---

## Overview

### Purpose
Phase V represents the culmination of the Evolution of Todo project, transforming it into an enterprise-grade, cloud-native, event-driven application deployed on DigitalOcean Kubernetes Service (DOKS). This phase implements microservices architecture, event streaming, advanced observability, and AI-powered operations for production excellence.

### Scope
This specification defines:
1. **Cloud-Native Architecture** - Microservices decomposition, 12-factor app compliance
2. **DOKS Deployment** - DigitalOcean managed Kubernetes with Spaces, Volumes, Load Balancers
3. **Event-Driven Design** - Apache Kafka for event streaming, async communication
4. **Dapr Integration** - Service invocation, pub/sub, state management, observability
5. **Advanced Observability** - Distributed tracing (Jaeger), metrics (Prometheus), logs (Loki)
6. **AIOps** - Anomaly detection, predictive scaling, auto-remediation
7. **Production Features** - Auto-scaling, multi-zone HA, disaster recovery, security hardening

### Key Innovations

**From Monolith to Microservices:**
- Task Service (CRUD operations)
- AI Service (conversational interface)
- Session Service (session management)
- Analytics Service (usage metrics)
- Notification Service (webhooks, alerts)

**From Request/Response to Events:**
- Task created → Event published
- AI analyzes task → Event consumed
- Notification sent → Event published
- Analytics updated → Event consumed

**From Reactive to Predictive:**
- Manual scaling → AI-powered auto-scaling
- Alert fatigue → Anomaly detection
- Incident response → Auto-remediation
- Capacity planning → Predictive analytics

---

## Cloud-Native Architecture

### Microservices Decomposition

#### FR-48: Service Architecture
**ID:** FR-48
**Priority:** Critical
**Description:** Decompose monolithic application into domain-driven microservices.

**Service Breakdown:**

```
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway (Kong/Traefik)                │
│                    Routes, Auth, Rate Limiting                   │
└────────────┬──────────────────────────────────┬─────────────────┘
             │                                   │
    ┌────────▼────────┐                 ┌───────▼────────┐
    │  Session        │                 │  AI Service    │
    │  Service        │                 │  (FastAPI)     │
    │  (FastAPI)      │                 │                │
    │                 │                 │ - Intent       │
    │ - Create session│                 │ - NLP          │
    │ - Context mgmt  │                 │ - OpenAI/Ollama│
    │ - History       │                 └───────┬────────┘
    └────────┬────────┘                         │
             │                                   │
             │         ┌─────────────────────────┤
             │         │                         │
    ┌────────▼─────────▼─────┐         ┌────────▼────────┐
    │  Task Service          │         │  Analytics      │
    │  (FastAPI)             │         │  Service        │
    │                        │         │  (FastAPI)      │
    │ - CRUD operations      │         │                 │
    │ - Priority, tags       │         │ - Usage metrics │
    │ - Search, filter, sort │         │ - Aggregations  │
    │ - Due dates            │         │ - Dashboards    │
    └────────┬───────────────┘         └────────┬────────┘
             │                                   │
             └────────────┬──────────────────────┘
                          │
                ┌─────────▼─────────┐
                │  Notification     │
                │  Service          │
                │  (FastAPI)        │
                │                   │
                │ - Webhooks        │
                │ - Email (future)  │
                │ - Slack (future)  │
                └───────────────────┘

                    All services communicate via:
                    ┌─────────────────────┐
                    │  Apache Kafka       │
                    │  (Event Broker)     │
                    └─────────────────────┘

                    Managed by:
                    ┌─────────────────────┐
                    │  Dapr Sidecar       │
                    │  (Service Mesh)     │
                    └─────────────────────┘
```

**Service Specifications:**

| Service | Port | Database | Events Published | Events Consumed |
|---------|------|----------|-----------------|-----------------|
| API Gateway | 80/443 | None | None | None |
| Session Service | 8001 | Redis | session.created, session.expired | None |
| AI Service | 8002 | None | intent.recognized | message.received |
| Task Service | 8003 | PostgreSQL | task.created, task.updated, task.deleted, task.completed | None |
| Analytics Service | 8004 | ClickHouse | None | task.*, session.* |
| Notification Service | 8005 | None | notification.sent | task.created, task.due_soon |

---

#### FR-49: Service Communication Patterns
**ID:** FR-49
**Priority:** Critical
**Description:** Define synchronous and asynchronous communication patterns.

**Synchronous Communication (Dapr Service Invocation):**
- API Gateway → Session Service (create session)
- API Gateway → AI Service (send message)
- AI Service → Task Service (CRUD operations)

**Asynchronous Communication (Kafka Events):**
- Task Service → Analytics Service (task events)
- Task Service → Notification Service (task created)
- Session Service → Analytics Service (session events)

**Communication Matrix:**

| From Service | To Service | Method | Protocol | Use Case |
|--------------|-----------|--------|----------|----------|
| API Gateway | Session Service | Sync | HTTP/Dapr | Create session |
| API Gateway | AI Service | Sync | HTTP/Dapr | Send message |
| AI Service | Task Service | Sync | HTTP/Dapr | Task operations |
| Task Service | Analytics | Async | Kafka/Dapr Pub/Sub | Metrics |
| Task Service | Notification | Async | Kafka/Dapr Pub/Sub | Alerts |
| Session Service | Analytics | Async | Kafka/Dapr Pub/Sub | Session data |

**Retry & Circuit Breaker:**
- Retry: 3 attempts with exponential backoff (100ms, 200ms, 400ms)
- Circuit Breaker: Open after 5 failures, half-open after 30s
- Timeout: 5s for sync calls, 30s for async

---

#### FR-50: Data Management Strategy
**ID:** FR-50
**Priority:** High
**Description:** Database per service pattern with eventual consistency.

**Data Stores:**

**PostgreSQL (Task Service):**
- Tables: tasks, task_history
- Managed: DigitalOcean Managed PostgreSQL
- Backups: Daily automated snapshots
- Replication: Primary + 2 read replicas

**Redis (Session Service):**
- Data: Session context, conversation history
- Managed: DigitalOcean Managed Redis
- Persistence: AOF + RDB
- TTL: 30 minutes (sessions)

**ClickHouse (Analytics Service):**
- Data: Time-series metrics, aggregations
- Managed: Self-hosted on DOKS
- Retention: 90 days (metrics), 1 year (aggregates)
- Sharding: By month

**Dapr State Store (Transient):**
- Data: Workflow state, locks
- Backend: Redis
- Consistency: Strong

**Data Consistency:**
- **Strong Consistency:** Within a service (ACID)
- **Eventual Consistency:** Across services (Events)
- **Saga Pattern:** For distributed transactions

---

### 12-Factor App Compliance

#### FR-51: Twelve-Factor Methodology
**ID:** FR-51
**Priority:** High
**Description:** All services comply with 12-factor app principles.

**Compliance Matrix:**

| Factor | Implementation |
|--------|---------------|
| 1. Codebase | One repo per service, tracked in Git |
| 2. Dependencies | requirements.txt, explicit versions |
| 3. Config | Environment variables via ConfigMap/Secrets |
| 4. Backing Services | PostgreSQL, Redis, Kafka as attached resources |
| 5. Build/Release/Run | CI/CD pipeline (GitHub Actions) |
| 6. Processes | Stateless containers (state in Redis/Postgres) |
| 7. Port Binding | Self-contained FastAPI apps on distinct ports |
| 8. Concurrency | Horizontal scaling via Kubernetes HPA |
| 9. Disposability | Fast startup (<30s), graceful shutdown |
| 10. Dev/Prod Parity | Same containers, same dependencies |
| 11. Logs | Stdout/stderr to centralized logging (Loki) |
| 12. Admin Processes | One-off tasks via kubectl exec or jobs |

---

## DigitalOcean Kubernetes (DOKS) Deployment

### Infrastructure Specification

#### FR-52: DOKS Cluster Configuration
**ID:** FR-52
**Priority:** Critical
**Description:** Managed Kubernetes cluster on DigitalOcean with HA configuration.

**Cluster Specifications:**

**Metadata:**
- Name: `todo-app-prod`
- Region: `nyc1` (primary), `sfo3` (DR)
- Version: Kubernetes 1.28+
- Auto-upgrade: Enabled (patch versions)

**Node Pools:**

| Pool Name | Size | Count | Auto-scale | Purpose |
|-----------|------|-------|------------|---------|
| system | s-2vcpu-4gb | 2 | No | System pods (Dapr, monitoring) |
| services | s-4vcpu-8gb | 3-10 | Yes | Application services |
| kafka | s-8vcpu-16gb | 3 | No | Kafka brokers |
| analytics | c-8-16gib | 2-5 | Yes | ClickHouse, analytics workloads |

**Auto-scaling:**
- Min nodes: 3 (services pool)
- Max nodes: 10 (services pool)
- Scale-up threshold: CPU >70% for 5 min
- Scale-down threshold: CPU <30% for 10 min

**Networking:**
- VPC: Dedicated VPC per environment
- CNI: Cilium (eBPF-based)
- Network Policies: Enabled
- Load Balancer: DigitalOcean Load Balancer (managed)

**Expected Terraform Configuration:**
```hcl
resource "digitalocean_kubernetes_cluster" "todo_app" {
  name    = "todo-app-prod"
  region  = "nyc1"
  version = "1.28.2-do.0"

  node_pool {
    name       = "system"
    size       = "s-2vcpu-4gb"
    node_count = 2
    labels = {
      pool = "system"
    }
  }

  node_pool {
    name       = "services"
    size       = "s-4vcpu-8gb"
    auto_scale = true
    min_nodes  = 3
    max_nodes  = 10
    labels = {
      pool = "services"
    }
  }
}
```

---

#### FR-53: DigitalOcean Managed Services
**ID:** FR-53
**Priority:** High
**Description:** Leverage DigitalOcean managed services for data layer.

**Managed PostgreSQL:**
- Plan: Production (HA)
- Size: 4 vCPU, 8 GB RAM
- Nodes: 1 primary + 2 standby replicas
- Storage: 100 GB SSD (auto-expand)
- Backups: Daily automated, 7-day retention
- Connection Pool: PgBouncer built-in
- SSL: Required (TLS 1.2+)

**Managed Redis:**
- Plan: Production (HA)
- Size: 2 vCPU, 4 GB RAM
- Nodes: 1 primary + 1 replica
- Persistence: AOF enabled
- Eviction: allkeys-lru
- SSL: Required

**Spaces (Object Storage):**
- Bucket: `todo-app-prod-backups`
- Region: `nyc3`
- Purpose: Database backups, logs archive
- Lifecycle: Delete after 90 days
- Versioning: Enabled

**Volumes (Block Storage):**
- Kafka data: 3x 100GB volumes (SSD)
- ClickHouse data: 2x 200GB volumes (SSD)
- Retention: Keep on cluster deletion (manual cleanup)

**Load Balancer:**
- Type: Application Load Balancer
- SSL: Termination at LB
- Health checks: HTTP /health every 10s
- Sticky sessions: Enabled (cookie-based)
- DDoS protection: Enabled

---

#### FR-54: Infrastructure as Code (IaC)
**ID:** FR-54
**Priority:** High
**Description:** Declarative infrastructure using Terraform.

**Terraform Structure:**
```
terraform/
├── main.tf                  # Provider configuration
├── variables.tf             # Input variables
├── outputs.tf               # Output values
├── modules/
│   ├── doks/
│   │   ├── main.tf          # DOKS cluster
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── database/
│   │   ├── main.tf          # PostgreSQL + Redis
│   │   └── variables.tf
│   ├── networking/
│   │   ├── main.tf          # VPC, firewall rules
│   │   └── variables.tf
│   └── storage/
│       ├── main.tf          # Spaces, Volumes
│       └── variables.tf
├── environments/
│   ├── dev.tfvars
│   ├── staging.tfvars
│   └── prod.tfvars
└── backend.tf               # Remote state (S3-compatible)
```

**State Management:**
- Backend: Terraform Cloud or DigitalOcean Spaces
- Locking: Enabled
- Encryption: At rest

**Deployment Command:**
```bash
terraform init
terraform plan -var-file=environments/prod.tfvars
terraform apply -var-file=environments/prod.tfvars
```

---

## Event-Driven Design

### Event Sourcing & CQRS

#### FR-55: Event Catalog
**ID:** FR-55
**Priority:** Critical
**Description:** Comprehensive event schema for all domain events.

**Event Schema Standard:**
```json
{
  "eventId": "uuid",
  "eventType": "task.created",
  "eventVersion": "1.0",
  "timestamp": "2025-12-31T10:00:00Z",
  "source": "task-service",
  "subject": "task/123",
  "data": {
    // Event-specific payload
  },
  "metadata": {
    "correlationId": "req-abc123",
    "causationId": "evt-xyz789",
    "userId": "user-001"
  }
}
```

**Event Types:**

**Task Events (task-service):**

| Event Type | Trigger | Payload |
|------------|---------|---------|
| `task.created` | New task added | task_id, description, priority, tags, due_date |
| `task.updated` | Task modified | task_id, changed_fields, old_values, new_values |
| `task.deleted` | Task removed | task_id, deletion_reason |
| `task.completed` | Task marked done | task_id, completion_time, time_to_complete |
| `task.due_soon` | Due in <24h | task_id, due_date, hours_remaining |
| `task.overdue` | Past due date | task_id, due_date, days_overdue |

**Session Events (session-service):**

| Event Type | Trigger | Payload |
|------------|---------|---------|
| `session.created` | New session | session_id, user_id, client_info |
| `session.message_received` | User message | session_id, message, timestamp |
| `session.expired` | Timeout | session_id, duration, message_count |

**AI Events (ai-service):**

| Event Type | Trigger | Payload |
|------------|---------|---------|
| `intent.recognized` | NLP processing | session_id, intent, confidence, parameters |
| `intent.failed` | Low confidence | session_id, message, confidence |

**Notification Events (notification-service):**

| Event Type | Trigger | Payload |
|------------|---------|---------|
| `notification.sent` | Webhook delivered | notification_id, type, recipient, status |
| `notification.failed` | Delivery error | notification_id, error, retry_count |

---

#### FR-56: Event Producers
**ID:** FR-56
**Priority:** Critical
**Description:** Services publish events to Kafka via Dapr Pub/Sub.

**Producer Configuration:**

**Task Service:**
```python
# Publish event via Dapr
dapr_client.publish_event(
    pubsub_name='kafka-pubsub',
    topic_name='task-events',
    data={
        'eventType': 'task.created',
        'data': {
            'task_id': task.id,
            'description': task.description,
            'priority': task.priority
        }
    }
)
```

**Event Publishing Rules:**
- Publish AFTER database commit (transactional outbox pattern)
- Include correlation ID for tracing
- Set appropriate partition key (task_id, session_id)
- Retry on publish failure (3 attempts)

**Transactional Outbox:**
```sql
CREATE TABLE outbox (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(100),
  event_data JSONB,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Outbox Processor:**
- Polling interval: 1 second
- Batch size: 100 events
- Mark as published after Kafka ACK

---

#### FR-57: Event Consumers
**ID:** FR-57
**Priority:** Critical
**Description:** Services consume events via Dapr Pub/Sub subscriptions.

**Consumer Configuration:**

**Analytics Service:**
```yaml
apiVersion: dapr.io/v1alpha1
kind: Subscription
metadata:
  name: task-events-subscription
spec:
  pubsubname: kafka-pubsub
  topic: task-events
  route: /events/task
  metadata:
    consumerGroup: analytics-service
```

**Consumer Handler:**
```python
@app.post('/events/task')
async def handle_task_event(event: CloudEvent):
    if event.type == 'task.created':
        await analytics.record_task_creation(event.data)
    elif event.type == 'task.completed':
        await analytics.record_task_completion(event.data)
    return {'status': 'SUCCESS'}
```

**Consumer Guarantees:**
- At-least-once delivery
- Idempotent handlers (deduplicate by eventId)
- Dead letter queue for failed events
- Consumer lag monitoring (<1 minute)

---

#### FR-58: CQRS Pattern
**ID:** FR-58
**Priority:** Medium
**Description:** Separate read and write models for optimal performance.

**Command Model (Write):**
- Task Service handles all writes
- Validates business rules
- Publishes events to Kafka
- Returns immediately after write

**Query Model (Read):**
- Analytics Service maintains read-optimized views
- Denormalized data for fast queries
- Updated asynchronously via events
- Eventually consistent with write model

**Use Cases:**

**Command Side:**
- Create task → Task Service
- Update task → Task Service
- Delete task → Task Service

**Query Side:**
- Dashboard metrics → Analytics Service
- Usage reports → Analytics Service
- Task completion trends → Analytics Service

**Benefits:**
- Optimized write performance
- Optimized read performance
- Independent scaling
- Simplified caching strategy

---

## Dapr Integration

### Dapr Building Blocks

#### FR-59: Dapr Architecture
**ID:** FR-59
**Priority:** Critical
**Description:** Deploy Dapr as sidecar for distributed application capabilities.

**Dapr Components:**

```
┌──────────────────────────────────────────────────────────┐
│                    Service Pod                           │
│  ┌──────────────┐            ┌──────────────┐           │
│  │              │    HTTP    │              │           │
│  │  Application │◄──────────►│ Dapr Sidecar │           │
│  │  Container   │  localhost │  Container   │           │
│  │              │            │              │           │
│  └──────────────┘            └───────┬──────┘           │
│                                      │                   │
└──────────────────────────────────────┼───────────────────┘
                                       │
                        ┌──────────────┼──────────────┐
                        │              │              │
              ┌─────────▼────────┐ ┌──▼────────┐ ┌──▼─────────┐
              │ Pub/Sub          │ │ State     │ │ Service    │
              │ (Kafka)          │ │ (Redis)   │ │ Invocation │
              └──────────────────┘ └───────────┘ └────────────┘
```

**Dapr Building Blocks Used:**

| Block | Component | Purpose |
|-------|-----------|---------|
| Service Invocation | HTTP | Service-to-service communication |
| Pub/Sub | Kafka | Event publishing/subscription |
| State Management | Redis | Session state, workflow state |
| Observability | Zipkin | Distributed tracing |
| Secrets | Kubernetes | Secret management |
| Bindings | None | Future: external systems |

---

#### FR-60: Dapr Service Invocation
**ID:** FR-60
**Priority:** High
**Description:** Service-to-service calls via Dapr sidecar with retries, tracing.

**Invocation Pattern:**
```python
# AI Service calling Task Service
response = requests.post(
    'http://localhost:3500/v1.0/invoke/task-service/method/tasks',
    json={
        'description': 'Buy groceries',
        'priority': 'high'
    }
)
```

**Dapr Features:**
- Service discovery (no hardcoded URLs)
- Automatic retries (3 attempts)
- Timeouts (5s default)
- Circuit breaker (5 failures → open for 30s)
- Distributed tracing (automatic headers)
- mTLS encryption (automatic)

**Service Configuration:**
```yaml
apiVersion: dapr.io/v1alpha1
kind: Configuration
metadata:
  name: daprConfig
spec:
  tracing:
    samplingRate: "1"
    zipkin:
      endpointAddress: "http://zipkin:9411/api/v2/spans"
  mtls:
    enabled: true
```

---

#### FR-61: Dapr Pub/Sub
**ID:** FR-61
**Priority:** Critical
**Description:** Event publishing and subscription via Dapr abstraction.

**Pub/Sub Component:**
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kafka-pubsub
spec:
  type: pubsub.kafka
  version: v1
  metadata:
  - name: brokers
    value: "kafka-0.kafka-headless:9092,kafka-1.kafka-headless:9092,kafka-2.kafka-headless:9092"
  - name: authType
    value: "none"
  - name: consumerGroup
    value: "{appId}"
  - name: clientId
    value: "{appId}"
```

**Publishing:**
```python
dapr_client.publish_event(
    pubsub_name='kafka-pubsub',
    topic_name='task-events',
    data=event_payload,
    data_content_type='application/json'
)
```

**Subscribing:**
```yaml
apiVersion: dapr.io/v1alpha1
kind: Subscription
metadata:
  name: task-events-sub
spec:
  pubsubname: kafka-pubsub
  topic: task-events
  route: /events/task
  metadata:
    consumerGroup: analytics-service
```

**Benefits:**
- Portable across message brokers (Kafka, RabbitMQ, etc.)
- Automatic retry with exponential backoff
- Dead letter topics for failed messages
- Cloud Events standard compliance

---

#### FR-62: Dapr State Management
**ID:** FR-62
**Priority:** High
**Description:** Distributed state store for session and workflow data.

**State Store Component:**
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: statestore
spec:
  type: state.redis
  version: v1
  metadata:
  - name: redisHost
    value: redis-master:6379
  - name: redisPassword
    secretKeyRef:
      name: redis-secret
      key: password
  - name: actorStateStore
    value: "true"
```

**State Operations:**
```python
# Save state
dapr_client.save_state(
    store_name='statestore',
    key=f'session-{session_id}',
    value=session_data,
    options=StateOptions(consistency=Consistency.strong)
)

# Get state
state = dapr_client.get_state(
    store_name='statestore',
    key=f'session-{session_id}'
)

# Delete state
dapr_client.delete_state(
    store_name='statestore',
    key=f'session-{session_id}'
)
```

**Features:**
- Strong or eventual consistency
- Concurrency control (ETags)
- Bulk operations
- TTL support
- Transactions

---

## Apache Kafka Specification

### Kafka Cluster Configuration

#### FR-63: Kafka Deployment
**ID:** FR-63
**Priority:** Critical
**Description:** Production-grade Kafka cluster on DOKS for event streaming.

**Cluster Specifications:**

**Topology:**
- Brokers: 3 (across availability zones)
- ZooKeeper: 3 nodes (or KRaft mode for newer versions)
- Replication Factor: 3
- Min In-Sync Replicas: 2

**Resource Allocation:**
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: kafka
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: kafka
        image: confluentinc/cp-kafka:7.5.0
        resources:
          requests:
            cpu: 2000m
            memory: 4Gi
          limits:
            cpu: 4000m
            memory: 8Gi
        volumeMounts:
        - name: data
          mountPath: /var/lib/kafka/data
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: do-block-storage
      resources:
        requests:
          storage: 100Gi
```

**Configuration Parameters:**
```properties
# Replication & Durability
default.replication.factor=3
min.insync.replicas=2
unclean.leader.election.enable=false

# Performance
num.network.threads=8
num.io.threads=16
socket.send.buffer.bytes=102400
socket.receive.buffer.bytes=102400

# Retention
log.retention.hours=168  # 7 days
log.segment.bytes=1073741824  # 1GB
log.retention.check.interval.ms=300000

# Compression
compression.type=snappy
```

---

#### FR-64: Kafka Topics
**ID:** FR-64
**Priority:** Critical
**Description:** Topic design for event categories with appropriate configurations.

**Topic Catalog:**

| Topic Name | Partitions | Retention | Producers | Consumers |
|------------|-----------|-----------|-----------|-----------|
| task-events | 6 | 7 days | task-service | analytics, notification |
| session-events | 3 | 3 days | session-service | analytics |
| intent-events | 3 | 3 days | ai-service | analytics |
| notification-events | 3 | 7 days | notification-service | analytics |
| dead-letter | 1 | 30 days | All | Monitoring |

**Topic Creation:**
```bash
kubectl exec -it kafka-0 -- kafka-topics \
  --create \
  --topic task-events \
  --partitions 6 \
  --replication-factor 3 \
  --config retention.ms=604800000 \
  --config min.insync.replicas=2 \
  --bootstrap-server localhost:9092
```

**Partition Key Strategy:**
- task-events: Partition by `task_id` (preserve order per task)
- session-events: Partition by `session_id` (preserve order per session)
- intent-events: Partition by `session_id`
- notification-events: Round-robin (no ordering required)

---

#### FR-65: Kafka Connect (Optional)
**ID:** FR-65
**Priority:** Low
**Description:** Kafka Connect for data integration with external systems.

**Use Cases:**
- Sink Connector: Kafka → ClickHouse (analytics data)
- Sink Connector: Kafka → S3 (event archival)
- Source Connector: PostgreSQL CDC → Kafka (change data capture)

**Example Configuration:**
```json
{
  "name": "clickhouse-sink",
  "config": {
    "connector.class": "com.clickhouse.kafka.connect.ClickHouseSinkConnector",
    "tasks.max": "3",
    "topics": "task-events,session-events",
    "clickhouse.server.url": "http://clickhouse:8123",
    "clickhouse.table.name": "events",
    "key.converter": "org.apache.kafka.connect.json.JsonConverter",
    "value.converter": "org.apache.kafka.connect.json.JsonConverter"
  }
}
```

---

#### FR-66: Kafka Monitoring
**ID:** FR-66
**Priority:** High
**Description:** Comprehensive monitoring of Kafka cluster health and performance.

**Metrics to Monitor:**

**Broker Metrics:**
- Under-replicated partitions (should be 0)
- Offline partitions (should be 0)
- Active controller count (should be 1)
- Request rate, byte rate
- Disk usage per broker

**Topic Metrics:**
- Messages in per second
- Bytes in per second
- Consumer lag per consumer group

**Consumer Metrics:**
- Consumer lag (messages behind)
- Commit rate
- Rebalance rate

**Prometheus Exporter:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kafka-exporter
spec:
  template:
    spec:
      containers:
      - name: kafka-exporter
        image: danielqsj/kafka-exporter:latest
        args:
        - --kafka.server=kafka-0.kafka-headless:9092
        - --kafka.server=kafka-1.kafka-headless:9092
        - --kafka.server=kafka-2.kafka-headless:9092
        ports:
        - containerPort: 9308
```

**Alerts:**
- Consumer lag >1000 messages
- Under-replicated partitions >0 for 5 min
- Offline partitions >0 for 1 min
- Broker disk usage >80%

---

## Observability Stack

### Three Pillars of Observability

#### FR-67: Distributed Tracing (Jaeger)
**ID:** FR-67
**Priority:** Critical
**Description:** End-to-end request tracing across microservices.

**Jaeger Architecture:**
```
Services (with Dapr) → Jaeger Agent → Jaeger Collector → Storage (Elasticsearch)
                                                          ↓
                                                    Jaeger Query UI
```

**Deployment:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jaeger
spec:
  template:
    spec:
      containers:
      - name: jaeger
        image: jaegertracing/all-in-one:1.51
        env:
        - name: COLLECTOR_ZIPKIN_HOST_PORT
          value: ":9411"
        - name: SPAN_STORAGE_TYPE
          value: "elasticsearch"
        - name: ES_SERVER_URLS
          value: "http://elasticsearch:9200"
        ports:
        - containerPort: 16686  # UI
        - containerPort: 14268  # Collector HTTP
        - containerPort: 9411   # Zipkin compatible
```

**Trace Context Propagation:**
- Automatic via Dapr sidecars
- OpenTelemetry format
- Trace ID, Span ID in logs

**Sample Trace:**
```
Trace: User creates task via chat
├─ Span: API Gateway (20ms)
│  └─ Span: Session Service (15ms)
├─ Span: AI Service (2.5s)
│  ├─ Span: OpenAI API Call (2.3s)
│  └─ Span: Task Service (100ms)
│     ├─ Span: PostgreSQL INSERT (40ms)
│     └─ Span: Kafka Publish (30ms)
└─ Span: Notification Service (50ms)
```

**Sampling Strategy:**
- Production: 10% sampling
- Staging: 50% sampling
- Development: 100% sampling

---

#### FR-68: Metrics (Prometheus + Grafana)
**ID:** FR-68
**Priority:** Critical
**Description:** Time-series metrics collection and visualization.

**Prometheus Deployment:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
      evaluation_interval: 15s

    scrape_configs:
    - job_name: 'kubernetes-pods'
      kubernetes_sd_configs:
      - role: pod
      relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__

    - job_name: 'kafka'
      static_configs:
      - targets: ['kafka-exporter:9308']

    - job_name: 'postgresql'
      static_configs:
      - targets: ['postgres-exporter:9187']
```

**Key Metrics:**

**Application Metrics:**
- `http_requests_total{service, endpoint, status}`
- `http_request_duration_seconds{service, endpoint}`
- `task_operations_total{operation}`
- `active_sessions_count`
- `ai_requests_total{model, status}`
- `ai_request_duration_seconds{model}`

**Infrastructure Metrics:**
- `node_cpu_usage`
- `node_memory_usage`
- `pod_cpu_usage{pod, namespace}`
- `pod_memory_usage{pod, namespace}`
- `kafka_consumer_lag{topic, consumer_group}`

**Grafana Dashboards:**
1. **Service Overview** - Request rates, latencies, error rates per service
2. **Kafka Monitoring** - Broker health, topic throughput, consumer lag
3. **Database Performance** - Query latency, connection pool, cache hit rate
4. **Kubernetes Cluster** - Node resources, pod status, deployments
5. **Business Metrics** - Tasks created, completion rate, user engagement

---

#### FR-69: Centralized Logging (Loki)
**ID:** FR-69
**Priority:** High
**Description:** Log aggregation and querying with Grafana Loki.

**Loki Stack:**
```
Pods (logs to stdout) → Promtail (DaemonSet) → Loki → Grafana
```

**Promtail Configuration:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: promtail-config
data:
  promtail.yaml: |
    server:
      http_listen_port: 9080

    clients:
      - url: http://loki:3100/loki/api/v1/push

    positions:
      filename: /tmp/positions.yaml

    scrape_configs:
    - job_name: kubernetes-pods
      kubernetes_sd_configs:
      - role: pod
      pipeline_stages:
      - docker: {}
      - json:
          expressions:
            timestamp: timestamp
            level: level
            message: message
            service: service
            trace_id: trace_id
      - labels:
          level:
          service:
      - timestamp:
          source: timestamp
          format: RFC3339
      relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        target_label: app
      - source_labels: [__meta_kubernetes_namespace]
        target_label: namespace
```

**Log Format (JSON):**
```json
{
  "timestamp": "2025-12-31T10:00:00Z",
  "level": "INFO",
  "service": "task-service",
  "message": "Task created successfully",
  "trace_id": "abc123def456",
  "task_id": 123,
  "user_id": "user-001"
}
```

**LogQL Queries:**
```logql
# All errors in task-service
{app="task-service"} |= "ERROR"

# Trace-specific logs
{trace_id="abc123def456"}

# High latency requests
{app="ai-service"} | json | duration > 2s
```

---

## AIOps Implementation

### AI-Powered Operations

#### FR-70: Anomaly Detection
**ID:** FR-70
**Priority:** High
**Description:** Machine learning for automatic anomaly detection in metrics and logs.

**Anomaly Detection System:**

**Data Sources:**
- Prometheus metrics (time-series)
- Application logs (structured JSON)
- Kubernetes events
- Business metrics (tasks, sessions)

**ML Models:**

| Model | Algorithm | Use Case | Training Data |
|-------|-----------|----------|---------------|
| Metric Anomaly | LSTM/Prophet | Detect metric spikes/drops | 30 days historical |
| Log Anomaly | Isolation Forest | Detect unusual log patterns | 14 days historical |
| Error Prediction | Random Forest | Predict service failures | Incident history |

**Architecture:**
```
Prometheus → Anomaly Detector (Python) → Alert Manager → PagerDuty/Slack
                    ↓
              Model Storage (S3)
                    ↓
            Retraining Pipeline (Daily)
```

**Anomaly Types Detected:**
- Sudden traffic spike (>3 std dev from baseline)
- Response time degradation (>2x normal)
- Error rate increase (>5% total requests)
- Resource exhaustion (CPU/Memory >90%)
- Unusual event patterns (e.g., many deletions)

**Response Actions:**
- Create incident in PagerDuty
- Post to Slack #alerts channel
- Auto-scale if capacity-related
- Trigger auto-remediation workflow (if safe)

---

#### FR-71: Predictive Auto-Scaling
**ID:** FR-71
**Priority:** Medium
**Description:** ML-based prediction of load for proactive scaling.

**Prediction Model:**

**Input Features:**
- Historical request rate (last 7 days)
- Time of day, day of week
- Active sessions count
- Recent growth trend
- Upcoming scheduled events (if known)

**Output:**
- Predicted request rate for next 15 minutes
- Recommended replica count

**Training:**
- Model: ARIMA or LSTM
- Training frequency: Daily at 02:00 UTC
- Evaluation metric: RMSE < 10% of actual

**Scaling Logic:**
```python
def predict_and_scale():
    predicted_load = model.predict(next_15_min)
    current_replicas = get_current_replicas()

    if predicted_load > threshold_high:
        scale_up(replicas=current_replicas + 2)
    elif predicted_load < threshold_low:
        scale_down(replicas=max(current_replicas - 1, min_replicas))
```

**Benefits:**
- Proactive scaling before load spike
- Reduced latency during traffic surges
- Cost optimization (scale down during low traffic)

---

#### FR-72: Auto-Remediation
**ID:** FR-72
**Priority:** Medium
**Description:** Automated corrective actions for common failures.

**Remediation Playbooks:**

| Issue | Detection | Remediation | Approval |
|-------|-----------|-------------|----------|
| Pod crash loop | Pod restarts >3 in 5 min | Restart deployment | Auto |
| High memory | Memory >90% for 5 min | Scale up replicas | Auto |
| Kafka consumer lag | Lag >1000 for 10 min | Add consumer replicas | Auto |
| Database connection pool exhausted | Connection errors >50/min | Increase pool size, restart app | Manual |
| Certificate expiring | <7 days to expiry | Renew via cert-manager | Auto |

**Remediation Workflow:**
```yaml
apiVersion: workflows.argoproj.io/v1alpha1
kind: Workflow
metadata:
  name: auto-remediate-high-memory
spec:
  entrypoint: remediate
  templates:
  - name: remediate
    steps:
    - - name: verify-issue
        template: check-memory
    - - name: scale-up
        template: kubectl-scale
        when: "{{steps.verify-issue.outputs.result}} == true"
    - - name: notify
        template: send-slack-notification
```

**Safety Guardrails:**
- Max auto-actions: 3 per hour
- Approval required for destructive actions
- Rollback capability for all auto-remediations
- Incident logging for audit trail

---

#### FR-73: Intelligent Alerting
**ID:** FR-73
**Priority:** High
**Description:** Context-aware, prioritized alerts with root cause analysis.

**Alert Correlation:**
- Group related alerts (e.g., high CPU + slow requests)
- Identify root cause alert vs symptoms
- Suppress duplicate/redundant alerts
- Calculate alert priority based on business impact

**Alert Priority Matrix:**

| Severity | Criteria | Response Time | Escalation |
|----------|----------|---------------|------------|
| P1 - Critical | Service down, data loss | 15 minutes | Immediate page |
| P2 - High | Degraded performance, high error rate | 1 hour | Slack + email |
| P3 - Medium | Resource warnings, anomalies | 4 hours | Slack only |
| P4 - Low | Informational, planned maintenance | 24 hours | Log only |

**Root Cause Analysis:**
```
Alert: API Gateway high latency

AI Analysis:
1. Identified correlated alerts:
   - AI Service slow response
   - OpenAI API timeout errors
2. Root cause: OpenAI API degradation
3. Recommended action: Switch to Ollama fallback
4. Incident timeline: 10:23 - Latency spike
                      10:24 - OpenAI errors detected
                      10:25 - Automatic fallback triggered
```

**Alert Fatigue Reduction:**
- Smart grouping (n alerts → 1 incident)
- Silence during maintenance windows
- Auto-resolve when metric recovers
- ML-based noise filtering

---

## Production Readiness

### High Availability

#### FR-74: Multi-Zone Deployment
**ID:** FR-74
**Priority:** Critical
**Description:** Deploy services across multiple availability zones for HA.

**Zone Distribution:**
```
Zone nyc1-a:  1 replica per service
Zone nyc1-b:  1 replica per service
Zone nyc1-c:  1 replica per service
```

**Pod Anti-Affinity:**
```yaml
affinity:
  podAntiAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
    - labelSelector:
        matchExpressions:
        - key: app
          operator: In
          values:
          - task-service
      topologyKey: topology.kubernetes.io/zone
```

**Benefits:**
- Survive single zone failure
- Zero downtime during zone maintenance
- Load distribution across zones

**DigitalOcean Zones:**
- Primary Region: NYC1 (3 zones)
- DR Region: SFO3 (3 zones)

---

#### FR-75: Disaster Recovery
**ID:** FR-75
**Priority:** High
**Description:** Backup, restore, and failover procedures for disaster scenarios.

**RTO & RPO Targets:**
- **RTO (Recovery Time Objective):** 1 hour
- **RPO (Recovery Point Objective):** 5 minutes

**Backup Strategy:**

**PostgreSQL:**
- Automated daily snapshots (managed by DigitalOcean)
- Point-in-time recovery (PITR) with WAL archiving
- Cross-region replication to SFO3
- Backup retention: 30 days

**Redis:**
- AOF persistence every second
- RDB snapshots every hour
- Replicate to secondary node
- Backup to Spaces every 6 hours

**Kafka:**
- MirrorMaker 2 to DR cluster (SFO3)
- Topic replication lag <10 seconds
- Retained for 7 days in DR cluster

**Application Data:**
- Configuration in Git (GitOps)
- Secrets in Vault (replicated)
- Helm charts versioned and tagged

**DR Failover Procedure:**
```bash
# 1. Verify primary region down
kubectl --context=nyc1 get nodes  # No response

# 2. Promote DR region
kubectl --context=sfo3 apply -f manifests/

# 3. Update DNS to point to SFO3 Load Balancer
doctl compute load-balancer update --forwarding-rules "..."

# 4. Verify application health
curl https://todo-app-dr.example.com/health
```

**DR Testing:**
- Quarterly failover drills
- Automated DR environment testing (weekly)
- Runbook documentation and training

---

#### FR-76: Chaos Engineering
**ID:** FR-76
**Priority:** Medium
**Description:** Proactive resilience testing using chaos experiments.

**Chaos Mesh Experiments:**

**Pod Failure:**
```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: PodChaos
metadata:
  name: pod-failure-test
spec:
  action: pod-failure
  mode: one
  selector:
    namespaces:
    - todo-app
    labelSelectors:
      app: task-service
  scheduler:
    cron: "@weekly"
```

**Network Delay:**
```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: network-delay-test
spec:
  action: delay
  mode: all
  selector:
    namespaces:
    - todo-app
  delay:
    latency: "100ms"
    correlation: "25"
  duration: "5m"
```

**Experiment Types:**
- Pod failure (random pod kill)
- Network latency injection
- CPU stress testing
- Disk I/O saturation
- DNS failures

**Chaos Schedule:**
- Production: Monthly (during maintenance window)
- Staging: Weekly
- Development: On-demand

---

### Performance Optimization

#### FR-77: Auto-Scaling Configuration
**ID:** FR-77
**Priority:** Critical
**Description:** Horizontal and vertical auto-scaling for services.

**Horizontal Pod Autoscaler (HPA):**
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: task-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: task-service
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "1000"
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 30
```

**Vertical Pod Autoscaler (VPA):**
```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: ai-service-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ai-service
  updatePolicy:
    updateMode: "Auto"
  resourcePolicy:
    containerPolicies:
    - containerName: ai-service
      minAllowed:
        cpu: 500m
        memory: 512Mi
      maxAllowed:
        cpu: 4000m
        memory: 8Gi
```

**Cluster Autoscaler:**
- Managed by DOKS
- Scale node pool from 3 to 10 nodes
- Scale-up when pods unschedulable
- Scale-down when node utilization <30%

---

#### FR-78: Caching Strategy
**ID:** FR-78
**Priority:** High
**Description:** Multi-layer caching for performance optimization.

**Cache Layers:**

**L1 - Application Cache (In-Memory):**
- Library: `aiocache` (Python)
- TTL: 60 seconds
- Eviction: LRU
- Use case: Intent classification results

**L2 - Distributed Cache (Redis):**
- TTL: 5 minutes (session data), 1 hour (read models)
- Eviction: allkeys-lru
- Use case: Session state, analytics read models

**L3 - CDN Cache (CloudFlare/Fastly):**
- TTL: 1 hour (static content)
- Invalidation: On deployment
- Use case: API documentation, health checks

**Cache Invalidation:**
- Write-through: Update cache on every write
- Write-behind: Async cache update via events
- TTL-based: Expire after fixed time
- Event-driven: Invalidate on relevant events

**Example:**
```python
@cache(ttl=300, key_prefix='task')
async def get_task(task_id: int) -> Task:
    # Cache miss: fetch from database
    task = await db.get_task(task_id)
    return task
```

---

### Security Hardening

#### FR-79: Zero Trust Security
**ID:** FR-79
**Priority:** Critical
**Description:** Implement zero trust principles across the platform.

**Zero Trust Pillars:**

**1. Identity Verification:**
- Service-to-service: mTLS via Dapr
- User-to-service: OAuth 2.0 / JWT (future)
- Every request authenticated

**2. Least Privilege:**
- RBAC for Kubernetes resources
- IAM roles for cloud resources
- Service accounts with minimal permissions

**3. Micro-Segmentation:**
- NetworkPolicies per service
- Deny all, allow specific
- Egress filtering

**4. Encryption:**
- TLS 1.3 for all traffic
- Secrets encrypted at rest (etcd)
- Database encryption at rest

**Network Policy Example:**
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: task-service-netpol
spec:
  podSelector:
    matchLabels:
      app: task-service
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: ai-service
    ports:
    - port: 8003
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: postgres
    ports:
    - port: 5432
  - to:
    - podSelector:
        matchLabels:
          app: kafka
    ports:
    - port: 9092
```

---

#### FR-80: Compliance & Auditing
**ID:** FR-80
**Priority:** High
**Description:** Compliance with security standards and audit logging.

**Compliance Frameworks:**
- SOC 2 Type II readiness
- GDPR compliance (data privacy)
- PCI DSS (if handling payments in future)

**Audit Logging:**

**What to Log:**
- All API requests (who, what, when, where)
- Authentication/authorization events
- Configuration changes (Kubernetes, Dapr)
- Data access (sensitive operations)
- Security events (failed auth, policy violations)

**Log Retention:**
- Real-time logs: 7 days (Loki)
- Audit logs: 1 year (Spaces archive)
- Compliance logs: 7 years (cold storage)

**Audit Log Format:**
```json
{
  "timestamp": "2025-12-31T10:00:00Z",
  "event_type": "task.created",
  "actor": {
    "user_id": "user-001",
    "session_id": "sess-abc123",
    "ip_address": "192.168.1.100"
  },
  "resource": {
    "type": "task",
    "id": "123"
  },
  "action": "create",
  "result": "success",
  "details": {
    "description": "Buy groceries",
    "priority": "high"
  }
}
```

**Compliance Automation:**
- Falco for runtime security
- Open Policy Agent (OPA) for policy enforcement
- Trivy for image scanning
- Kube-bench for CIS benchmarks

---

## Acceptance Criteria

### AC-1: Cloud-Native Architecture
- [ ] Services decomposed into 5 microservices
- [ ] Each service independently deployable
- [ ] Service-to-service communication via Dapr
- [ ] Async communication via Kafka events
- [ ] Database per service implemented
- [ ] CQRS pattern implemented (Task/Analytics)
- [ ] 12-factor app compliance verified

### AC-2: DOKS Deployment
- [ ] DOKS cluster provisioned via Terraform
- [ ] 3 node pools configured (system, services, kafka)
- [ ] Managed PostgreSQL connected
- [ ] Managed Redis connected
- [ ] Spaces configured for backups
- [ ] Load Balancer routes traffic correctly
- [ ] Auto-scaling functional (3-10 nodes)

### AC-3: Event-Driven Design
- [ ] All 6 event types published correctly
- [ ] Transactional outbox pattern implemented
- [ ] Event consumers process messages
- [ ] Dead letter queue handles failures
- [ ] Event schema validation enforced
- [ ] Consumer lag monitored and <1 min
- [ ] Idempotent event handlers verified

### AC-4: Dapr Integration
- [ ] Dapr sidecars deployed with all services
- [ ] Service invocation works with retries
- [ ] Pub/Sub via Kafka functional
- [ ] State management via Redis working
- [ ] Distributed tracing automatic
- [ ] mTLS enabled and verified
- [ ] Secrets management via Kubernetes

### AC-5: Kafka Cluster
- [ ] 3-broker Kafka cluster running
- [ ] All topics created with correct config
- [ ] Replication factor = 3
- [ ] Min in-sync replicas = 2
- [ ] Kafka exporter provides metrics
- [ ] Consumer groups functional
- [ ] No data loss during broker restart

### AC-6: Observability Stack
- [ ] Jaeger collects distributed traces
- [ ] Prometheus scrapes all metrics
- [ ] Grafana dashboards display data
- [ ] Loki aggregates logs
- [ ] LogQL queries work correctly
- [ ] Alerts fire appropriately
- [ ] Trace context propagates across services

### AC-7: AIOps Implementation
- [ ] Anomaly detection model trained
- [ ] Anomalies detected and alerted
- [ ] Predictive auto-scaling functional
- [ ] Auto-remediation playbooks execute
- [ ] Alert correlation working
- [ ] Root cause analysis provided
- [ ] Alert fatigue reduced (<10 alerts/day)

### AC-8: High Availability
- [ ] Services deployed across 3 zones
- [ ] Pod anti-affinity enforced
- [ ] Zero downtime during zone failure
- [ ] Database replicas in sync
- [ ] Kafka replicates across zones
- [ ] Load balanced across zones
- [ ] Health checks prevent traffic to unhealthy pods

### AC-9: Disaster Recovery
- [ ] Daily backups automated
- [ ] Point-in-time recovery tested
- [ ] Cross-region replication active
- [ ] DR failover tested successfully
- [ ] RTO <1 hour achieved
- [ ] RPO <5 minutes achieved
- [ ] Runbook documented and validated

### AC-10: Performance
- [ ] API latency p99 <500ms
- [ ] Handle 10,000 requests/sec
- [ ] HPA scales services appropriately
- [ ] Cache hit rate >80%
- [ ] Database query time p95 <100ms
- [ ] Kafka throughput >100k msgs/sec
- [ ] No memory leaks during load test

### AC-11: Security
- [ ] mTLS enabled for all service traffic
- [ ] NetworkPolicies deny by default
- [ ] RBAC configured with least privilege
- [ ] Secrets encrypted at rest
- [ ] Image vulnerabilities scanned (no CRITICAL)
- [ ] Audit logs captured
- [ ] Compliance checks pass (OPA, Falco)

### AC-12: Chaos Engineering
- [ ] Pod failure experiments pass
- [ ] Network delay experiments pass
- [ ] Application recovers automatically
- [ ] No data loss during chaos
- [ ] Monitoring detects failures
- [ ] Alerts fire during chaos
- [ ] SLOs maintained during experiments

### AC-13: Production Readiness
- [ ] All services have readiness/liveness probes
- [ ] Graceful shutdown implemented
- [ ] Resource limits set appropriately
- [ ] Runbooks documented
- [ ] On-call rotation defined
- [ ] Incident management process defined
- [ ] SLOs/SLAs documented

---

## Deployment Checklist

### Pre-Deployment
- [ ] Terraform configuration reviewed
- [ ] Secrets stored in Vault
- [ ] DNS records configured
- [ ] SSL certificates provisioned
- [ ] Backup strategy tested
- [ ] DR plan documented
- [ ] Load testing completed
- [ ] Security audit passed

### Deployment
- [ ] Provision infrastructure via Terraform
- [ ] Deploy Kafka cluster
- [ ] Deploy Dapr control plane
- [ ] Deploy observability stack
- [ ] Deploy microservices
- [ ] Configure auto-scaling
- [ ] Enable monitoring/alerting
- [ ] Run smoke tests

### Post-Deployment
- [ ] Verify all health checks green
- [ ] Verify metrics flowing to Prometheus
- [ ] Verify logs aggregating in Loki
- [ ] Verify traces in Jaeger
- [ ] Run integration tests
- [ ] Verify DR replication active
- [ ] Schedule chaos experiments
- [ ] Document lessons learned

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 5.0.0 | 2025-12-31 | Human Architect | Final phase: Cloud-native, event-driven, AIOps |

---

## Approval

**Specification Status:** Ready for Implementation

**Next Steps:**
1. Human reviews and approves final architecture
2. Provision DigitalOcean infrastructure
3. Hand off to Claude Code for implementation
4. Incremental deployment (service by service)
5. Load testing and optimization
6. Security audit
7. Production launch

---

**Document Owner:** Human Architect
**Implementation Owner:** Claude Code (when approved)
**Governed By:** CONSTITUTION.md v1.0.0
**Completes:** Evolution of Todo - All Phases (I-V)

---

## Conclusion

Phase V represents the pinnacle of the Evolution of Todo project, transforming a simple CLI todo application into an enterprise-grade, cloud-native, event-driven system with AI-powered operations. This specification provides a complete blueprint for production deployment on DigitalOcean Kubernetes Service with comprehensive observability, resilience, and operational excellence.

**The Journey:**
- **Phase I:** Console CLI with basic CRUD
- **Phase II:** Organization features (priority, tags, search)
- **Phase III:** Conversational AI with FastAPI + OpenAI
- **Phase IV:** Containerization, Kubernetes, Helm, Minikube
- **Phase V:** Microservices, Event-Driven, DOKS, AIOps, Production-Ready

**Achievement Unlocked:** Enterprise-Grade Todo Application 🚀
