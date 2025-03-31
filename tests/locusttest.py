from locust import HttpUser, task, between
from faker import Faker
import random

fake = Faker()
VALID_CATEGORIES = [2, 6, 7, 8]

class ProductUser(HttpUser):
    wait_time = between(1, 5)

    def on_start(self):
        self.headers = {"Content-Type": "application/json"}
        self.login()
        self.created_products = []
        self.user_id = None

    def login(self):
        login_data = {
            "email": "manager@example.ru",
            "password": "123456"
        }
        with self.client.post("/api/v1/users/login", json=login_data, catch_response=True) as response:
            if response.status_code in [200, 201]:
                data = response.json()
                if 'user' in data and data['user']:
                    self.user_id = data['user'].get('userId')
                else:
                    response.failure("Missing user data in response")
            else:
                response.failure(f"Login failed: {response.text}")

    @task(3)
    def create_product(self):
        if not self.user_id:
            return

        product_data = {
            "productName": fake.catch_phrase(),
            "description": fake.text(max_nb_chars=200),
            "price": round(random.uniform(10, 1000), 2),
            "quantity": random.randint(1, 100),
            "categoryId": random.choice(VALID_CATEGORIES)
        }

        with self.client.post(
            "/api/v1/products",
            json=product_data,
            params={"userId": self.user_id},
            catch_response=True,
            name="/products [POST]"
        ) as response:
            if response.status_code in [200, 201]:
                product = response.json()
                if 'productId' in product:
                    self.created_products.append(product['productId'])
                else:
                    response.failure("Missing productId in response")
            else:
                response.failure(f"Create failed: {response.text}")

    @task(5)
    def browse_products(self):
        # Просмотр списка товаров
        with self.client.get("/api/v1/products", catch_response=True) as list_response:
            if list_response.status_code == 200:
                products = list_response.json().get('items', [])
                if products:
                    # Просмотр случайного товара
                    product = random.choice(products)
                    self.client.get(
                        f"/api/v1/products/{product['productId']}",
                        name="/products/:id [GET]"
                    )

    @task(2)
    def update_product(self):
        if not self.user_id or not self.created_products:
            return

        product_id = random.choice(self.created_products)
        update_data = {
            "productName": fake.catch_phrase(),
            "description": fake.text(max_nb_chars=200),
            "price": round(random.uniform(10, 1000), 2)
        }

        with self.client.put(
            f"/api/v1/products/{product_id}",
            json=update_data,
            params={"userId": self.user_id},
            catch_response=True,
            name="/products/:id [PUT]"
        ) as response:
            if response.status_code not in [200, 201]:
                response.failure(f"Update failed: {response.text}")

    @task(1)
    def delete_product(self):
        if not self.user_id or not self.created_products:
            return

        product_id = self.created_products.pop()
        with self.client.delete(
            f"/api/v1/products/{product_id}",
            params={"userId": self.user_id},
            catch_response=True,
            name="/products/:id [DELETE]"
        ) as response:
            if response.status_code not in [200, 204]:
                response.failure(f"Delete failed: {response.text}")

    @task(4)
    def view_statistics(self):
       # Для статистики по конкретному товару
       if self.created_products:
           product_id = random.choice(self.created_products)
           self.client.get(
               "/api/v1/products/feedbackStats/18",
               headers=self.headers,
               name="/feedbackStats/:id"
           )