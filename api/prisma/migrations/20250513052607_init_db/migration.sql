-- CreateEnum
CREATE TYPE "application_jobcontracttype_enum" AS ENUM ('FULL_TIME', 'PART_TIME', 'FREELANCE', 'INTERNSHIP');

-- CreateEnum
CREATE TYPE "application_status_enum" AS ENUM ('APPLIED', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED', 'WITHDRAWN', 'ACCEPTED', 'DECLINED');

-- CreateEnum
CREATE TYPE "application_status_status_enum" AS ENUM ('APPLIED', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED', 'WITHDRAWN', 'ACCEPTED', 'DECLINED');

-- CreateEnum
CREATE TYPE "job_contracttype_enum" AS ENUM ('FULL_TIME', 'PART_TIME', 'FREELANCE', 'INTERNSHIP');

-- CreateTable
CREATE TABLE "admin" (
    "id" UUID NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
    "seekerId" UUID NOT NULL,
    "jobId" UUID NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
    "seekerName" VARCHAR,
    "seekerPhone" VARCHAR,
    "seekerEmail" VARCHAR,
    "seekerShortDescription" TEXT,
    "experiences" JSON,
    "education" JSON,
    "jobTitle" VARCHAR,
    "jobContractType" "application_jobcontracttype_enum",
    "status" "application_status_enum" NOT NULL DEFAULT 'APPLIED',

    CONSTRAINT "PK_569e0c3e863ebdf5f2408ee1670" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_status" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "recruiterId" UUID NOT NULL,
    "recruiterName" VARCHAR,
    "recruiterResponse" VARCHAR,
    "status" "application_status_status_enum" NOT NULL DEFAULT 'APPLIED',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,

    CONSTRAINT "PK_7e957f206d5d171db7d25f57697" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hiring_company" (
    "id" UUID NOT NULL,
    "title" VARCHAR NOT NULL,
    "description" TEXT,
    "country" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,

    CONSTRAINT "PK_f71c2b2f0abd4ca2d59236051ea" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job" (
    "id" UUID NOT NULL,
    "title" VARCHAR NOT NULL,
    "description" TEXT NOT NULL,
    "country" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
    "publisherId" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "contractType" "job_contracttype_enum" NOT NULL,

    CONSTRAINT "PK_98ab1c14ff8d1cf80d18703b92f" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recruiter" (
    "id" UUID NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "companyAdmin" BOOLEAN NOT NULL DEFAULT false,
    "companyId" UUID,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PK_e10c71ef86a9be2a6aead8eadfa" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seeker" (
    "id" UUID NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "phone" VARCHAR NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "experiences" JSON,
    "education" JSON,

    CONSTRAINT "PK_40c70b62e7b0087bdd3f383ed3b" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_de87485f6489f5d0995f5841952" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_ec6610f232573009dfecae5bdf3" ON "recruiter"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_90fe9533a68edaa27a93520821f" ON "seeker"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_69f13d8a5dbbe5a60931b82c4ef" ON "seeker"("phone");

-- AddForeignKey
ALTER TABLE "application" ADD CONSTRAINT "FK_76e40e7c10f3fcccc373c22a8e2" FOREIGN KEY ("seekerId") REFERENCES "seeker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application" ADD CONSTRAINT "FK_dbc0341504212f830211b69ba0c" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_status" ADD CONSTRAINT "FK_117f791db002e1fe951cf1eefb8" FOREIGN KEY ("applicationId") REFERENCES "application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_status" ADD CONSTRAINT "FK_fbe321b8ee08015277d1c8d4302" FOREIGN KEY ("recruiterId") REFERENCES "recruiter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "FK_ce14aa44d30c4b64671bfd38f46" FOREIGN KEY ("publisherId") REFERENCES "recruiter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "FK_e66170573cabd565dab1132727d" FOREIGN KEY ("companyId") REFERENCES "hiring_company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recruiter" ADD CONSTRAINT "FK_c55c06de5bcab4f6a2ebb8d1810" FOREIGN KEY ("companyId") REFERENCES "hiring_company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
