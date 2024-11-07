import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserIdToUuid1731013141247 implements MigrationInterface {
    name = 'UpdateUserIdToUuid1731013141247'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // First drop the view that depends on the userId column
        await queryRunner.query(`DROP VIEW IF EXISTS product_feedback_statistics`);

        // Now we can safely modify the tables
        await queryRunner.query(`ALTER TABLE "feedbacks" DROP CONSTRAINT "FK_4e742e54bc087d921d0f7f7f8c4"`);
        await queryRunner.query(`ALTER TABLE "feedbacks" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "feedbacks" ADD "userId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "feedbacks" DROP COLUMN "userUserId"`);
        await queryRunner.query(`ALTER TABLE "feedbacks" ADD "userUserId" uuid`);

        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_6a4ebad71685a4ed11e89b3e834"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "userId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "userUserId"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "userUserId" uuid`);

        await queryRunner.query(`ALTER TABLE "logs" DROP CONSTRAINT "FK_896c70f9af7fe859072dfb64da5"`);
        await queryRunner.query(`ALTER TABLE "logs" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "logs" ADD "userId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "logs" DROP COLUMN "userUserId"`);
        await queryRunner.query(`ALTER TABLE "logs" ADD "userUserId" uuid`);

        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_8bf09ba754322ab9c22a215c919"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "userId" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_8bf09ba754322ab9c22a215c919" PRIMARY KEY ("userId")`);

        await queryRunner.query(`ALTER TABLE "feedbacks" ADD CONSTRAINT "FK_4e742e54bc087d921d0f7f7f8c4" FOREIGN KEY ("userUserId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_6a4ebad71685a4ed11e89b3e834" FOREIGN KEY ("userUserId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "logs" ADD CONSTRAINT "FK_896c70f9af7fe859072dfb64da5" FOREIGN KEY ("userUserId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        // Recreate the view after all table modifications are complete
        await queryRunner.query(`
            CREATE OR REPLACE VIEW product_feedback_statistics AS
            SELECT 
                p."productName",
                COUNT(f."feedbackId") as total_feedbacks,
                AVG(f.rate) as average_rating,
                STRING_AGG(f.content, ' | ' ORDER BY f.date DESC) as recent_feedbacks
            FROM products p
            LEFT JOIN (
                SELECT * FROM feedbacks ORDER BY date DESC LIMIT 3
            ) f ON p."productId" = f."productId"
            GROUP BY p."productName"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // First drop the view
        await queryRunner.query(`DROP VIEW IF EXISTS product_feedback_statistics`);

        await queryRunner.query(`ALTER TABLE "logs" DROP CONSTRAINT "FK_896c70f9af7fe859072dfb64da5"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_6a4ebad71685a4ed11e89b3e834"`);
        await queryRunner.query(`ALTER TABLE "feedbacks" DROP CONSTRAINT "FK_4e742e54bc087d921d0f7f7f8c4"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_8bf09ba754322ab9c22a215c919"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "userId" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_8bf09ba754322ab9c22a215c919" PRIMARY KEY ("userId")`);
        await queryRunner.query(`ALTER TABLE "logs" DROP COLUMN "userUserId"`);
        await queryRunner.query(`ALTER TABLE "logs" ADD "userUserId" integer`);
        await queryRunner.query(`ALTER TABLE "logs" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "logs" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "logs" ADD CONSTRAINT "FK_896c70f9af7fe859072dfb64da5" FOREIGN KEY ("userUserId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "userUserId"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "userUserId" integer`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_6a4ebad71685a4ed11e89b3e834" FOREIGN KEY ("userUserId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feedbacks" DROP COLUMN "userUserId"`);
        await queryRunner.query(`ALTER TABLE "feedbacks" ADD "userUserId" integer`);
        await queryRunner.query(`ALTER TABLE "feedbacks" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "feedbacks" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "feedbacks" ADD CONSTRAINT "FK_4e742e54bc087d921d0f7f7f8c4" FOREIGN KEY ("userUserId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        // Recreate the view in its original form
        await queryRunner.query(`
            CREATE OR REPLACE VIEW product_feedback_statistics AS
            SELECT 
                p."productName",
                COUNT(f."feedbackId") as total_feedbacks,
                AVG(f.rate) as average_rating,
                STRING_AGG(f.content, ' | ' ORDER BY f.date DESC) as recent_feedbacks
            FROM products p
            LEFT JOIN (
                SELECT * FROM feedbacks ORDER BY date DESC LIMIT 3
            ) f ON p."productId" = f."productId"
            GROUP BY p."productName"
        `);

        await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
    }
}