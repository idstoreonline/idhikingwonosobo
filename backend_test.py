#!/usr/bin/env python3
"""
Backend API Test Suite for ID Hiking Rent Wonosobo
Tests all backend endpoints with comprehensive validation
"""

import requests
import json
import sys
from datetime import datetime

# Read base URL from .env file
def get_base_url():
    try:
        with open('/app/.env', 'r') as f:
            for line in f:
                if line.startswith('NEXT_PUBLIC_BASE_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"❌ Error reading .env file: {e}")
        sys.exit(1)
    return None

BASE_URL = get_base_url()
if not BASE_URL:
    print("❌ NEXT_PUBLIC_BASE_URL not found in .env")
    sys.exit(1)

API_BASE = f"{BASE_URL}/api"
print(f"🔗 Testing API at: {API_BASE}\n")

# Test results tracking
test_results = {
    'passed': 0,
    'failed': 0,
    'errors': []
}

def log_test(name, passed, message=""):
    """Log test result"""
    if passed:
        test_results['passed'] += 1
        print(f"✅ {name}")
        if message:
            print(f"   {message}")
    else:
        test_results['failed'] += 1
        test_results['errors'].append(f"{name}: {message}")
        print(f"❌ {name}")
        print(f"   {message}")

def test_get_products():
    """Test GET /api/products endpoint"""
    print("\n📦 Testing GET /api/products")
    print("=" * 60)
    
    try:
        # Test basic list
        response = requests.get(f"{API_BASE}/products", timeout=10)
        log_test(
            "GET /api/products - Status 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code != 200:
            return
        
        data = response.json()
        log_test(
            "Response has 'products' key",
            'products' in data,
            f"Keys: {list(data.keys())}"
        )
        
        if 'products' not in data:
            return
        
        products = data['products']
        log_test(
            "At least 20 products returned",
            len(products) >= 20,
            f"Count: {len(products)}"
        )
        
        if len(products) > 0:
            product = products[0]
            required_fields = ['id', 'name', 'category', 'size', 'stock', 'price', 'image', 'status', 'description']
            has_all_fields = all(field in product for field in required_fields)
            log_test(
                "Product has all required fields",
                has_all_fields,
                f"Fields: {list(product.keys())}"
            )
            
            # Check no _id field
            log_test(
                "Product does not have _id field",
                '_id' not in product,
                "MongoDB _id properly stripped"
            )
        
        # Test category filter
        response = requests.get(f"{API_BASE}/products?category=Tenda", timeout=10)
        if response.status_code == 200:
            data = response.json()
            products = data.get('products', [])
            all_tenda = all(p.get('category') == 'Tenda' for p in products)
            log_test(
                "Category filter (Tenda) works",
                all_tenda and len(products) > 0,
                f"Found {len(products)} Tenda products"
            )
        
        # Test search filter
        response = requests.get(f"{API_BASE}/products?q=carrier", timeout=10)
        if response.status_code == 200:
            data = response.json()
            products = data.get('products', [])
            has_carrier = any('carrier' in p.get('name', '').lower() for p in products)
            log_test(
                "Search filter (q=carrier) works",
                has_carrier and len(products) > 0,
                f"Found {len(products)} products with 'carrier'"
            )
        
        # Test sort price_asc
        response = requests.get(f"{API_BASE}/products?sort=price_asc", timeout=10)
        if response.status_code == 200:
            data = response.json()
            products = data.get('products', [])
            if len(products) >= 2:
                prices = [p.get('price', 0) for p in products]
                is_sorted = all(prices[i] <= prices[i+1] for i in range(len(prices)-1))
                log_test(
                    "Sort by price ascending works",
                    is_sorted,
                    f"First 3 prices: {prices[:3]}"
                )
        
        # Test sort price_desc
        response = requests.get(f"{API_BASE}/products?sort=price_desc", timeout=10)
        if response.status_code == 200:
            data = response.json()
            products = data.get('products', [])
            if len(products) >= 2:
                prices = [p.get('price', 0) for p in products]
                is_sorted = all(prices[i] >= prices[i+1] for i in range(len(prices)-1))
                log_test(
                    "Sort by price descending works",
                    is_sorted,
                    f"First 3 prices: {prices[:3]}"
                )
        
        # Test sort by stock
        response = requests.get(f"{API_BASE}/products?sort=stock", timeout=10)
        if response.status_code == 200:
            data = response.json()
            products = data.get('products', [])
            if len(products) >= 2:
                stocks = [p.get('stock', 0) for p in products]
                is_sorted = all(stocks[i] >= stocks[i+1] for i in range(len(stocks)-1))
                log_test(
                    "Sort by stock descending works",
                    is_sorted,
                    f"First 3 stocks: {stocks[:3]}"
                )
        
    except Exception as e:
        log_test("GET /api/products", False, f"Exception: {str(e)}")

def test_get_product_detail():
    """Test GET /api/products/{id} endpoint"""
    print("\n📦 Testing GET /api/products/{id}")
    print("=" * 60)
    
    try:
        # First get a product ID
        response = requests.get(f"{API_BASE}/products", timeout=10)
        if response.status_code != 200:
            log_test("GET product detail", False, "Could not fetch products list")
            return
        
        products = response.json().get('products', [])
        if len(products) == 0:
            log_test("GET product detail", False, "No products available")
            return
        
        product_id = products[0]['id']
        product_category = products[0]['category']
        
        # Test valid product ID
        response = requests.get(f"{API_BASE}/products/{product_id}", timeout=10)
        log_test(
            f"GET /api/products/{product_id} - Status 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code != 200:
            return
        
        data = response.json()
        log_test(
            "Response has 'product' and 'related' keys",
            'product' in data and 'related' in data,
            f"Keys: {list(data.keys())}"
        )
        
        if 'product' in data:
            product = data['product']
            log_test(
                "Product ID matches requested ID",
                product.get('id') == product_id,
                f"ID: {product.get('id')}"
            )
            
            log_test(
                "Product does not have _id field",
                '_id' not in product,
                "MongoDB _id properly stripped"
            )
        
        if 'related' in data:
            related = data['related']
            log_test(
                "Related products array exists",
                isinstance(related, list),
                f"Type: {type(related)}"
            )
            
            log_test(
                "Related products count <= 4",
                len(related) <= 4,
                f"Count: {len(related)}"
            )
            
            # Check none of related products have same ID
            related_ids = [p.get('id') for p in related]
            log_test(
                "Related products don't include same product",
                product_id not in related_ids,
                f"Related IDs: {related_ids[:3]}"
            )
            
            # Check all related products have same category
            if len(related) > 0:
                all_same_category = all(p.get('category') == product_category for p in related)
                log_test(
                    "All related products have same category",
                    all_same_category,
                    f"Category: {product_category}"
                )
        
        # Test non-existent ID
        response = requests.get(f"{API_BASE}/products/non-existent-id-12345", timeout=10)
        log_test(
            "Non-existent product returns 404",
            response.status_code == 404,
            f"Status: {response.status_code}"
        )
        
    except Exception as e:
        log_test("GET /api/products/{id}", False, f"Exception: {str(e)}")

def test_get_promos():
    """Test GET /api/promos endpoint"""
    print("\n🎁 Testing GET /api/promos")
    print("=" * 60)
    
    try:
        response = requests.get(f"{API_BASE}/promos", timeout=10)
        log_test(
            "GET /api/promos - Status 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code != 200:
            return
        
        data = response.json()
        log_test(
            "Response has 'promos' key",
            'promos' in data,
            f"Keys: {list(data.keys())}"
        )
        
        if 'promos' not in data:
            return
        
        promos = data['promos']
        log_test(
            "At least 5 promos returned",
            len(promos) >= 5,
            f"Count: {len(promos)}"
        )
        
        if len(promos) > 0:
            promo = promos[0]
            required_fields = ['title', 'subtitle', 'discount', 'color']
            has_all_fields = all(field in promo for field in required_fields)
            log_test(
                "Promo has required fields",
                has_all_fields,
                f"Fields: {list(promo.keys())}"
            )
            
            # Check all promos are active
            all_active = all(p.get('active') == True for p in promos)
            log_test(
                "All promos have active=true",
                all_active,
                "Only active promos returned"
            )
            
            log_test(
                "Promo does not have _id field",
                '_id' not in promo,
                "MongoDB _id properly stripped"
            )
        
    except Exception as e:
        log_test("GET /api/promos", False, f"Exception: {str(e)}")

def test_get_reviews():
    """Test GET /api/reviews endpoint"""
    print("\n⭐ Testing GET /api/reviews")
    print("=" * 60)
    
    try:
        response = requests.get(f"{API_BASE}/reviews", timeout=10)
        log_test(
            "GET /api/reviews - Status 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code != 200:
            return
        
        data = response.json()
        log_test(
            "Response has 'reviews' key",
            'reviews' in data,
            f"Keys: {list(data.keys())}"
        )
        
        if 'reviews' not in data:
            return
        
        reviews = data['reviews']
        log_test(
            "At least 6 reviews returned",
            len(reviews) >= 6,
            f"Count: {len(reviews)}"
        )
        
        if len(reviews) > 0:
            review = reviews[0]
            required_fields = ['name', 'avatar', 'rating', 'review']
            has_all_fields = all(field in review for field in required_fields)
            log_test(
                "Review has required fields",
                has_all_fields,
                f"Fields: {list(review.keys())}"
            )
            
            log_test(
                "Review does not have _id field",
                '_id' not in review,
                "MongoDB _id properly stripped"
            )
        
    except Exception as e:
        log_test("GET /api/reviews", False, f"Exception: {str(e)}")

def test_get_packages():
    """Test GET /api/packages endpoint"""
    print("\n📦 Testing GET /api/packages")
    print("=" * 60)
    
    try:
        response = requests.get(f"{API_BASE}/packages", timeout=10)
        log_test(
            "GET /api/packages - Status 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code != 200:
            return
        
        data = response.json()
        log_test(
            "Response has 'packages' key",
            'packages' in data,
            f"Keys: {list(data.keys())}"
        )
        
        if 'packages' not in data:
            return
        
        packages = data['packages']
        log_test(
            "At least 4 packages returned",
            len(packages) >= 4,
            f"Count: {len(packages)}"
        )
        
        if len(packages) > 0:
            package = packages[0]
            required_fields = ['name', 'price', 'subtitle', 'items']
            has_all_fields = all(field in package for field in required_fields)
            log_test(
                "Package has required fields",
                has_all_fields,
                f"Fields: {list(package.keys())}"
            )
            
            log_test(
                "Package items is an array",
                isinstance(package.get('items'), list),
                f"Items count: {len(package.get('items', []))}"
            )
            
            log_test(
                "Package does not have _id field",
                '_id' not in package,
                "MongoDB _id properly stripped"
            )
        
    except Exception as e:
        log_test("GET /api/packages", False, f"Exception: {str(e)}")

def test_get_faqs():
    """Test GET /api/faqs endpoint"""
    print("\n❓ Testing GET /api/faqs")
    print("=" * 60)
    
    try:
        response = requests.get(f"{API_BASE}/faqs", timeout=10)
        log_test(
            "GET /api/faqs - Status 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code != 200:
            return
        
        data = response.json()
        log_test(
            "Response has 'faqs' key",
            'faqs' in data,
            f"Keys: {list(data.keys())}"
        )
        
        if 'faqs' not in data:
            return
        
        faqs = data['faqs']
        log_test(
            "At least 7 FAQs returned",
            len(faqs) >= 7,
            f"Count: {len(faqs)}"
        )
        
        if len(faqs) > 0:
            faq = faqs[0]
            required_fields = ['q', 'a']
            has_all_fields = all(field in faq for field in required_fields)
            log_test(
                "FAQ has required fields (q, a)",
                has_all_fields,
                f"Fields: {list(faq.keys())}"
            )
            
            log_test(
                "FAQ does not have _id field",
                '_id' not in faq,
                "MongoDB _id properly stripped"
            )
        
    except Exception as e:
        log_test("GET /api/faqs", False, f"Exception: {str(e)}")

def test_get_settings():
    """Test GET /api/settings endpoint"""
    print("\n⚙️  Testing GET /api/settings")
    print("=" * 60)
    
    try:
        response = requests.get(f"{API_BASE}/settings", timeout=10)
        log_test(
            "GET /api/settings - Status 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code != 200:
            return
        
        data = response.json()
        log_test(
            "Response has 'settings' key",
            'settings' in data,
            f"Keys: {list(data.keys())}"
        )
        
        if 'settings' not in data:
            return
        
        settings = data['settings']
        required_fields = ['whatsapp', 'address', 'hours', 'bank']
        has_all_fields = all(field in settings for field in required_fields)
        log_test(
            "Settings has required fields",
            has_all_fields,
            f"Fields: {list(settings.keys())}"
        )
        
        log_test(
            "Settings does not have _id field",
            '_id' not in settings,
            "MongoDB _id properly stripped"
        )
        
    except Exception as e:
        log_test("GET /api/settings", False, f"Exception: {str(e)}")

def test_post_orders():
    """Test POST /api/orders endpoint"""
    print("\n🛒 Testing POST /api/orders")
    print("=" * 60)
    
    try:
        # First get a product to order
        response = requests.get(f"{API_BASE}/products", timeout=10)
        if response.status_code != 200:
            log_test("POST /api/orders", False, "Could not fetch products")
            return
        
        products = response.json().get('products', [])
        if len(products) == 0:
            log_test("POST /api/orders", False, "No products available")
            return
        
        product = products[0]
        
        # Create order
        order_data = {
            'productId': product['id'],
            'productName': product['name'],
            'qty': 2,
            'startDate': '2026-08-01',
            'endDate': '2026-08-03',
            'days': 2,
            'total': 60000,
            'message': 'Test order from automated testing'
        }
        
        response = requests.post(
            f"{API_BASE}/orders",
            json=order_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        log_test(
            "POST /api/orders - Status 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code != 200:
            return
        
        data = response.json()
        log_test(
            "Response has 'order' key",
            'order' in data,
            f"Keys: {list(data.keys())}"
        )
        
        if 'order' not in data:
            return
        
        order = data['order']
        
        log_test(
            "Order has id field",
            'id' in order,
            f"Order ID: {order.get('id')}"
        )
        
        log_test(
            "Order has invoiceNo starting with 'IDH-'",
            'invoiceNo' in order and order['invoiceNo'].startswith('IDH-'),
            f"Invoice: {order.get('invoiceNo')}"
        )
        
        log_test(
            "Order status is PENDING",
            order.get('status') == 'PENDING',
            f"Status: {order.get('status')}"
        )
        
        log_test(
            "Order has createdAt timestamp",
            'createdAt' in order,
            f"Created: {order.get('createdAt')}"
        )
        
        log_test(
            "Order does not have _id field",
            '_id' not in order,
            "MongoDB _id properly stripped"
        )
        
        # Verify order persisted - GET /api/orders
        response = requests.get(f"{API_BASE}/orders", timeout=10)
        if response.status_code == 200:
            data = response.json()
            orders = data.get('orders', [])
            order_ids = [o.get('id') for o in orders]
            log_test(
                "Order persisted in database",
                order['id'] in order_ids,
                f"Found {len(orders)} orders in database"
            )
        
    except Exception as e:
        log_test("POST /api/orders", False, f"Exception: {str(e)}")

def test_post_seed_reset():
    """Test POST /api/seed/reset endpoint"""
    print("\n🔄 Testing POST /api/seed/reset")
    print("=" * 60)
    
    try:
        response = requests.post(f"{API_BASE}/seed/reset", timeout=10)
        log_test(
            "POST /api/seed/reset - Status 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code != 200:
            return
        
        data = response.json()
        log_test(
            "Response has ok=true and reset=true",
            data.get('ok') == True and data.get('reset') == True,
            f"Response: {data}"
        )
        
        # Verify data still exists after reset
        response = requests.get(f"{API_BASE}/products", timeout=10)
        if response.status_code == 200:
            products = response.json().get('products', [])
            log_test(
                "Products still available after reset (>=20)",
                len(products) >= 20,
                f"Count: {len(products)}"
            )
        
    except Exception as e:
        log_test("POST /api/seed/reset", False, f"Exception: {str(e)}")

def print_summary():
    """Print test summary"""
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    print(f"✅ Passed: {test_results['passed']}")
    print(f"❌ Failed: {test_results['failed']}")
    print(f"📈 Total:  {test_results['passed'] + test_results['failed']}")
    
    if test_results['failed'] > 0:
        print("\n❌ FAILED TESTS:")
        for error in test_results['errors']:
            print(f"   • {error}")
        print("\n⚠️  BACKEND TESTS FAILED")
        sys.exit(1)
    else:
        print("\n✅ ALL BACKEND TESTS PASSED!")
        sys.exit(0)

if __name__ == "__main__":
    print("🚀 Starting Backend API Tests for ID Hiking Rent Wonosobo")
    print("=" * 60)
    
    # Run all tests
    test_get_products()
    test_get_product_detail()
    test_get_promos()
    test_get_reviews()
    test_get_packages()
    test_get_faqs()
    test_get_settings()
    test_post_orders()
    test_post_seed_reset()
    
    # Print summary
    print_summary()
