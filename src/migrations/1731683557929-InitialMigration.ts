import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1731683557929 implements MigrationInterface {
    name = 'InitialMigration1731683557929'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("categoryId" SERIAL NOT NULL, "categoryName" character varying(50) NOT NULL, "description" text NOT NULL, CONSTRAINT "PK_8a300c5ce0f70ed7945e877a537" PRIMARY KEY ("categoryId"))`);
        await queryRunner.query(`CREATE TABLE "feedbacks" ("feedbackId" SERIAL NOT NULL, "userId" character varying NOT NULL, "rate" integer NOT NULL, "content" text NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "userUserId" uuid, CONSTRAINT "PK_afc4a022b8f00a49eb6657c432d" PRIMARY KEY ("feedbackId"))`);
        await queryRunner.query(`CREATE TABLE "products" ("productId" SERIAL NOT NULL, "productName" character varying(255) NOT NULL, "description" text NOT NULL, "categoryId" integer NOT NULL, "price" integer NOT NULL, "quantity" integer NOT NULL, "imagesUrl" text array NOT NULL, "categoryCategoryId" integer, CONSTRAINT "PK_7b3b507508cd0f86a5b2e923459" PRIMARY KEY ("productId"))`);
        await queryRunner.query(`CREATE TABLE "orderedProducts" ("orderedProductId" SERIAL NOT NULL, "orderId" integer NOT NULL, "productId" integer NOT NULL, "quantity" integer NOT NULL, "orderOrderId" integer, "productProductId" integer, CONSTRAINT "PK_3365f725b8c34b09665820bd7f9" PRIMARY KEY ("orderedProductId"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("orderId" SERIAL NOT NULL, "userId" character varying NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying(50) NOT NULL, "total" integer NOT NULL, "userUserId" uuid, CONSTRAINT "PK_41ba27842ac1a2c24817ca59eaa" PRIMARY KEY ("orderId"))`);
        await queryRunner.query(`CREATE TABLE "logs" ("logId" SERIAL NOT NULL, "userId" character varying NOT NULL, "content" text NOT NULL, "type" character varying(20) NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "userUserId" uuid, CONSTRAINT "PK_8845add8ffde483f9a7b9696f2f" PRIMARY KEY ("logId"))`);
        await queryRunner.query(`CREATE TABLE "users" ("userId" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying(40) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "roleId" integer NOT NULL, "roleRoleId" integer, CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_8bf09ba754322ab9c22a215c919" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("roleId" SERIAL NOT NULL, "roleName" character varying(50) NOT NULL, "description" text NOT NULL, CONSTRAINT "PK_39bf7e8af8fe54d9d1c7a8efe6f" PRIMARY KEY ("roleId"))`);
        await queryRunner.query(`CREATE TABLE "product_feedbacks" ("id" SERIAL NOT NULL, "productProductId" integer, "feedbackFeedbackId" integer, CONSTRAINT "PK_137209d7e486adfc8b85688b4c5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "feedbacks" ADD CONSTRAINT "FK_4e742e54bc087d921d0f7f7f8c4" FOREIGN KEY ("userUserId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_a06a40e89f9347c0f1c7e6834eb" FOREIGN KEY ("categoryCategoryId") REFERENCES "category"("categoryId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orderedProducts" ADD CONSTRAINT "FK_97542e4a1ff7808f35af7592c20" FOREIGN KEY ("orderOrderId") REFERENCES "orders"("orderId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orderedProducts" ADD CONSTRAINT "FK_96b14a06239dbba8f6b26d68583" FOREIGN KEY ("productProductId") REFERENCES "products"("productId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_6a4ebad71685a4ed11e89b3e834" FOREIGN KEY ("userUserId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "logs" ADD CONSTRAINT "FK_896c70f9af7fe859072dfb64da5" FOREIGN KEY ("userUserId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_f32dd66b36a5aa53fc615781bed" FOREIGN KEY ("roleRoleId") REFERENCES "roles"("roleId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_feedbacks" ADD CONSTRAINT "FK_00bb79955fa1880821ea0f2cd9c" FOREIGN KEY ("productProductId") REFERENCES "products"("productId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_feedbacks" ADD CONSTRAINT "FK_f016e21a4601560beb211cbebed" FOREIGN KEY ("feedbackFeedbackId") REFERENCES "feedbacks"("feedbackId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_feedbacks" DROP CONSTRAINT "FK_f016e21a4601560beb211cbebed"`);
        await queryRunner.query(`ALTER TABLE "product_feedbacks" DROP CONSTRAINT "FK_00bb79955fa1880821ea0f2cd9c"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_f32dd66b36a5aa53fc615781bed"`);
        await queryRunner.query(`ALTER TABLE "logs" DROP CONSTRAINT "FK_896c70f9af7fe859072dfb64da5"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_6a4ebad71685a4ed11e89b3e834"`);
        await queryRunner.query(`ALTER TABLE "orderedProducts" DROP CONSTRAINT "FK_96b14a06239dbba8f6b26d68583"`);
        await queryRunner.query(`ALTER TABLE "orderedProducts" DROP CONSTRAINT "FK_97542e4a1ff7808f35af7592c20"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_a06a40e89f9347c0f1c7e6834eb"`);
        await queryRunner.query(`ALTER TABLE "feedbacks" DROP CONSTRAINT "FK_4e742e54bc087d921d0f7f7f8c4"`);
        await queryRunner.query(`DROP TABLE "product_feedbacks"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "logs"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "orderedProducts"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "feedbacks"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
