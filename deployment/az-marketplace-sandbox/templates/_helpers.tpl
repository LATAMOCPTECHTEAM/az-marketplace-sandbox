{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "az-marketplace-sandbox.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "az-marketplace-sandbox.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{- define "az-marketplace-sandbox.connectionString" -}}
{{- if .Values.database.connectionStringOverride -}}
{{- .Values.database.connectionStringOverride  -}}
{{- else -}}
{{- printf "mongodb://%s-db:27017/sandbox" (include "az-marketplace-sandbox.fullname" .)  | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}


{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "az-marketplace-sandbox.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Common labels
*/}}
{{- define "az-marketplace-sandbox.labels" -}}
helm.sh/chart: {{ include "az-marketplace-sandbox.chart" . }}
{{ include "az-marketplace-sandbox.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{/*
Selector labels
*/}}
{{- define "az-marketplace-sandbox.selectorLabels" -}}
app.kubernetes.io/name: {{ include "az-marketplace-sandbox.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{- define "az-marketplace-sandbox.selectorApp" -}}
app.kubernetes.io/deployment: "app"
{{- end -}}

{{- define "az-marketplace-sandbox.selectorDatabase" -}}
app.kubernetes.io/deployment: "database"
{{- end -}}

{{/*
Create the name of the service account to use
*/}}
{{- define "az-marketplace-sandbox.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
    {{ default (include "az-marketplace-sandbox.fullname" .) .Values.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.serviceAccount.name }}
{{- end -}}
{{- end -}}
