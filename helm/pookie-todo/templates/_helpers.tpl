{{/*
Expand the name of the chart.
*/}}
{{- define "pookie-todo.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "pookie-todo.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "pookie-todo.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "pookie-todo.labels" -}}
helm.sh/chart: {{ include "pookie-todo.chart" . }}
{{ include "pookie-todo.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "pookie-todo.selectorLabels" -}}
app.kubernetes.io/name: {{ include "pookie-todo.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Frontend selector labels
*/}}
{{- define "pookie-todo.frontend.selectorLabels" -}}
app: frontend
{{ include "pookie-todo.selectorLabels" . }}
{{- end }}

{{/*
Backend selector labels
*/}}
{{- define "pookie-todo.backend.selectorLabels" -}}
app: backend
{{ include "pookie-todo.selectorLabels" . }}
{{- end }}

{{/*
Create the name of the namespace
*/}}
{{- define "pookie-todo.namespace" -}}
{{- default "pookie-todo" .Values.namespaceOverride }}
{{- end }}
