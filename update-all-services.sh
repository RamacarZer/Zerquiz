#!/bin/bash
# TOPLU SERVİS GÜNCELLEME SCRİPTİ

echo "🚀 TÜM SERVİSLERİ GÜNCELLEME BAŞLIYOR..."

# Questions Service
echo "📝 Questions Service..."
cd F:/yeni_projeler/Zerquiz/services/questions/Zerquiz.Questions.Api
# Migration sil
rm -rf ../Zerquiz.Questions.Infrastructure/Persistence/Migrations/*
# Yeni migration
dotnet ef migrations add InitialProfessionalCreate --project ../Zerquiz.Questions.Infrastructure
dotnet ef database update --project ../Zerquiz.Questions.Infrastructure

# Exams Service
echo "📋 Exams Service..."
cd F:/yeni_projeler/Zerquiz/services/exams/Zerquiz.Exams.Api
rm -rf ../Zerquiz.Exams.Infrastructure/Persistence/Migrations/*
dotnet ef migrations add InitialProfessionalCreate --project ../Zerquiz.Exams.Infrastructure
dotnet ef database update --project ../Zerquiz.Exams.Infrastructure

# Grading Service
echo "✅ Grading Service..."
cd F:/yeni_projeler/Zerquiz/services/grading/Zerquiz.Grading.Api
rm -rf ../Zerquiz.Grading.Infrastructure/Persistence/Migrations/*
dotnet ef migrations add InitialProfessionalCreate --project ../Zerquiz.Grading.Infrastructure
dotnet ef database update --project ../Zerquiz.Grading.Infrastructure

# Royalty Service
echo "💰 Royalty Service..."
cd F:/yeni_projeler/Zerquiz/services/royalty/Zerquiz.Royalty.Api
rm -rf ../Zerquiz.Royalty.Infrastructure/Persistence/Migrations/*
dotnet ef migrations add InitialProfessionalCreate --project ../Zerquiz.Royalty.Infrastructure
dotnet ef database update --project ../Zerquiz.Royalty.Infrastructure

echo "✅ TÜM SERVİSLER GÜNCELLEND İ!"

