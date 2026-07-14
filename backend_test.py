#!/usr/bin/env python3
"""
Backend API Test Suite for ID Hiking Rent Wonosobo
Tests all backend endpoints including NEW admin & availability endpoints
"""

import requests
import json
import sys
from datetime import datetime, timedelta

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

def get_admin_password():
    try:
        with open('/app/.env', 'r') as f:
            for line in f:
                if line.startswith('ADMIN_PASSWORD='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"❌ Error reading .env file: {e}")
        return 'admin123'
    return 'admin123'

BASE_URL = get_base_url()
if not BASE_URL:
    print("❌ NEXT_PUBLIC_BASE_URL not found in .env")
    sys.exit(1)

ADMIN_PASSWORD = get_admin_password()
API_BASE = f"{BASE_URL}/api"
print(f"🔗 Testing API at: {API_BASE}")
print(f"🔑 Admin password: {ADMIN_PASSWORD}\n")

# Test results tracking
test_results = {
    'passed': 0,
    'failed': 0,
    'errors': []
}

# Global admin token
ADMIN_TOKEN = None

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

def test_admin_login():
    """Test POST /api/admin/login"""
    global ADMIN_TOKEN
    print("\n🔐 Testing POST /api/admin/login")
    print("=" * 60)
    
    try:
        # Test successful login
        response = requests.post(
            f"{API_BASE}/admin/login",
            json={'password': ADMIN_PASSWORD},
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        log_test(
            "POST /api/admin/login with correct password - Status 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code == 200:
            data = response.json()
            log_test(
                "Response has ok=true and token",
                data.get('ok') == True and 'token' in data,
                f"Response: {data}"
            )
            
            if 'token' in data:
                ADMIN_TOKEN = data['token']
                log_test(
                    "Token matches admin password",
                    ADMIN_TOKEN == ADMIN_PASSWORD,
                    f"Token: {ADMIN_TOKEN}"
                )
        
        # Test failed login
        response = requests.post(
            f"{API_BASE}/admin/login",
            json={'password': 'wrongpassword'},
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        log_test(
            "POST /api/admin/login with wrong password - Status 401",
            response.status_code == 401,
            f"Status: {response.status_code}"
        )
        
        if response.status_code == 401:
            data = response.json()
            log_test(
                "Error message is 'Password salah'",
                data.get('error') == 'Password salah',
                f"Error: {data.get('error')}"
            )
        
    except Exception as e:
        log_test("POST /api/admin/login", False, f"Exception: {str(e)}")

def test_admin_auth_guard():
    """Test admin auth guard - unauthorized access"""
    print("\n🛡️  Testing Admin Auth Guard")
    print("=" * 60)
    
    try:
        # Test GET /api/admin/stats without token
        response = requests.get(f"{API_BASE}/admin/stats", timeout=10)
        log_test(
            "GET /api/admin/stats without token - Status 401",
            response.status_code == 401,
            f"Status: {response.status_code}"
        )
        
        if response.status_code == 401:
            data = response.json()
            log_test(
                "Error message is 'Unauthorized'",
                data.get('error') == 'Unauthorized',
                f"Error: {data.get('error')}"
            )
        
        # Test GET /api/admin/products without token
        response = requests.get(f"{API_BASE}/admin/products", timeout=10)
        log_test(
            "GET /api/admin/products without token - Status 401",
            response.status_code == 401,
            f"Status: {response.status_code}"
        )
        
    except Exception as e:
        log_test("Admin auth guard", False, f"Exception: {str(e)}")

def test_admin_stats():
    """Test GET /api/admin/stats"""
    print("\n📊 Testing GET /api/admin/stats")
    print("=" * 60)
    
    if not ADMIN_TOKEN:
        log_test("GET /api/admin/stats", False, "No admin token available")
        return
    
    try:
        response = requests.get(
            f"{API_BASE}/admin/stats",
            headers={'x-admin-token': ADMIN_TOKEN},
            timeout=10
        )
        log_test(
            "GET /api/admin/stats with token - Status 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code != 200:
            return
        
        data = response.json()
        required_keys = ['todayBookings', 'monthRevenue', 'activePromos', 'lowStock', 'totalCustomers', 'productsCount']
        has_all_keys = all(key in data for key in required_keys)
        log_test(
            "Response has all required keys",
            has_all_keys,
            f"Keys: {list(data.keys())}"
        )
        
        log_test(
            "lowStock is an array",
            isinstance(data.get('lowStock'), list),
            f"lowStock count: {len(data.get('lowStock', []))}"
        )
        
        log_test(
            "todayBookings is a number",
            isinstance(data.get('todayBookings'), int),
            f"todayBookings: {data.get('todayBookings')}"
        )
        
        log_test(
            "monthRevenue is a number",
            isinstance(data.get('monthRevenue'), (int, float)),
            f"monthRevenue: {data.get('monthRevenue')}"
        )
        
    except Exception as e:
        log_test("GET /api/admin/stats", False, f"Exception: {str(e)}")

def test_admin_crud_products():
    """Test CRUD for /api/admin/products"""
    print("\n📦 Testing CRUD /api/admin/products")
    print("=" * 60)
    
    if not ADMIN_TOKEN:
        log_test("CRUD /api/admin/products", False, "No admin token available")
        return
    
    headers = {'x-admin-token': ADMIN_TOKEN, 'Content-Type': 'application/json'}
    created_id = None
    
    try:
        # POST - Create new product
        new_product = {
            'name': 'TEST BARANG AUTOMATED',
            'category': 'Aksesoris',
            'size': 'M',
            'stock': 5,
            'price': 20000,
            'image': 'https://example.com/test.jpg',
            'description': 'Test product from automated testing',
            'included': ['Item A', 'Item B']
        }
        
        response = requests.post(
            f"{API_BASE}/admin/products",
            json=new_product,
            headers=headers,
            timeout=10
        )
        log_test(
            "POST /api/admin/products - Status 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code == 200:
            data = response.json()
            log_test(
                "Response has 'item' key with id",
                'item' in data and 'id' in data['item'],
                f"Item ID: {data.get('item', {}).get('id')}"
            )
            
            if 'item' in data and 'id' in data['item']:
                created_id = data['item']['id']
        
        # GET - List products
        response = requests.get(
            f"{API_BASE}/admin/products",
            headers=headers,
            timeout=10
        )
        log_test(
            "GET /api/admin/products - Status 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code == 200 and created_id:
            data = response.json()
            items = data.get('items', [])
            item_ids = [item.get('id') for item in items]
            log_test(
                "New product present in list",
                created_id in item_ids,
                f"Found {len(items)} products"
            )
        
        # PUT - Update product
        if created_id:
            response = requests.put(
                f"{API_BASE}/admin/products/{created_id}",
                json={'price': 25000},
                headers=headers,
                timeout=10
            )
            log_test(
                f"PUT /api/admin/products/{created_id} - Status 200",
                response.status_code == 200,
                f"Status: {response.status_code}"
            )
            
            if response.status_code == 200:
                data = response.json()
                log_test(
                    "Product price updated to 25000",
                    data.get('item', {}).get('price') == 25000,
                    f"Price: {data.get('item', {}).get('price')}"
                )
        
        # DELETE - Delete product
        if created_id:
            response = requests.delete(
                f"{API_BASE}/admin/products/{created_id}",
                headers=headers,
                timeout=10
            )
            log_test(
                f"DELETE /api/admin/products/{created_id} - Status 200",
                response.status_code == 200,
                f"Status: {response.status_code}"
            )
            
            if response.status_code == 200:
                data = response.json()
                log_test(
                    "Response has ok=true",
                    data.get('ok') == True,
                    f"Response: {data}"
                )
            
            # Verify deletion
            response = requests.get(
                f"{API_BASE}/admin/products",
                headers=headers,
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                items = data.get('items', [])
                item_ids = [item.get('id') for item in items]
                log_test(
                    "Product no longer in list after deletion",
                    created_id not in item_ids,
                    f"Product deleted successfully"
                )
        
    except Exception as e:
        log_test("CRUD /api/admin/products", False, f"Exception: {str(e)}")

def test_admin_crud_collection(collection_name, sample_data):
    """Generic test for admin CRUD on a collection"""
    print(f"\n📝 Testing CRUD /api/admin/{collection_name}")
    print("=" * 60)
    
    if not ADMIN_TOKEN:
        log_test(f"CRUD /api/admin/{collection_name}", False, "No admin token available")
        return
    
    headers = {'x-admin-token': ADMIN_TOKEN, 'Content-Type': 'application/json'}
    created_id = None
    
    try:
        # POST - Create
        response = requests.post(
            f"{API_BASE}/admin/{collection_name}",
            json=sample_data,
            headers=headers,
            timeout=10
        )
        log_test(
            f"POST /api/admin/{collection_name} - Status 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'item' in data and 'id' in data['item']:
                created_id = data['item']['id']
        
        # GET - List
        response = requests.get(
            f"{API_BASE}/admin/{collection_name}",
            headers=headers,
            timeout=10
        )
        log_test(
            f"GET /api/admin/{collection_name} - Status 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code == 200 and created_id:
            data = response.json()
            items = data.get('items', [])
            item_ids = [item.get('id') for item in items]
            log_test(
                f"New {collection_name} item present in list",
                created_id in item_ids,
                f"Found {len(items)} items"
            )
        
        # PUT - Update
        if created_id:
            update_field = list(sample_data.keys())[0]
            update_value = f"UPDATED_{sample_data[update_field]}"
            response = requests.put(
                f"{API_BASE}/admin/{collection_name}/{created_id}",
                json={update_field: update_value},
                headers=headers,
                timeout=10
            )
            log_test(
                f"PUT /api/admin/{collection_name}/{created_id} - Status 200",
                response.status_code == 200,
                f"Status: {response.status_code}"
            )
        
        # DELETE
        if created_id:
            response = requests.delete(
                f"{API_BASE}/admin/{collection_name}/{created_id}",
                headers=headers,
                timeout=10
            )
            log_test(
                f"DELETE /api/admin/{collection_name}/{created_id} - Status 200",
                response.status_code == 200,
                f"Status: {response.status_code}"
            )
            
            # Verify deletion
            response = requests.get(
                f"{API_BASE}/admin/{collection_name}",
                headers=headers,
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                items = data.get('items', [])
                item_ids = [item.get('id') for item in items]
                log_test(
                    f"{collection_name} item no longer in list",
                    created_id not in item_ids,
                    f"Item deleted successfully"
                )
        
    except Exception as e:
        log_test(f"CRUD /api/admin/{collection_name}", False, f"Exception: {str(e)}")

def test_admin_orders():
    """Test GET /api/admin/orders and PUT /api/admin/orders/{id}"""
    print("\n🛒 Testing Admin Orders Management")
    print("=" * 60)
    
    if not ADMIN_TOKEN:
        log_test("Admin orders management", False, "No admin token available")
        return
    
    headers = {'x-admin-token': ADMIN_TOKEN, 'Content-Type': 'application/json'}
    
    try:
        # GET - List orders
        response = requests.get(
            f"{API_BASE}/admin/orders",
            headers=headers,
            timeout=10
        )
        log_test(
            "GET /api/admin/orders - Status 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code == 200:
            data = response.json()
            log_test(
                "Response has 'items' key",
                'items' in data,
                f"Keys: {list(data.keys())}"
            )
            
            items = data.get('items', [])
            if len(items) > 0:
                order_id = items[0].get('id')
                
                # PUT - Update order status
                response = requests.put(
                    f"{API_BASE}/admin/orders/{order_id}",
                    json={'status': 'CONFIRMED'},
                    headers=headers,
                    timeout=10
                )
                log_test(
                    f"PUT /api/admin/orders/{order_id} - Status 200",
                    response.status_code == 200,
                    f"Status: {response.status_code}"
                )
                
                if response.status_code == 200:
                    data = response.json()
                    log_test(
                        "Order status updated to CONFIRMED",
                        data.get('item', {}).get('status') == 'CONFIRMED',
                        f"Status: {data.get('item', {}).get('status')}"
                    )
        
    except Exception as e:
        log_test("Admin orders management", False, f"Exception: {str(e)}")

def test_admin_settings():
    """Test GET /api/admin/settings and PUT /api/admin/settings"""
    print("\n⚙️  Testing Admin Settings Management")
    print("=" * 60)
    
    if not ADMIN_TOKEN:
        log_test("Admin settings management", False, "No admin token available")
        return
    
    headers = {'x-admin-token': ADMIN_TOKEN, 'Content-Type': 'application/json'}
    
    try:
        # GET - Get settings
        response = requests.get(
            f"{API_BASE}/admin/settings",
            headers=headers,
            timeout=10
        )
        log_test(
            "GET /api/admin/settings - Status 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code == 200:
            data = response.json()
            log_test(
                "Response has 'settings' key",
                'settings' in data,
                f"Keys: {list(data.keys())}"
            )
            
            original_hours = data.get('settings', {}).get('hours')
            
            # PUT - Update settings
            response = requests.put(
                f"{API_BASE}/admin/settings",
                json={'hours': '08:00-20:00'},
                headers=headers,
                timeout=10
            )
            log_test(
                "PUT /api/admin/settings - Status 200",
                response.status_code == 200,
                f"Status: {response.status_code}"
            )
            
            if response.status_code == 200:
                data = response.json()
                log_test(
                    "Settings hours updated to '08:00-20:00'",
                    data.get('settings', {}).get('hours') == '08:00-20:00',
                    f"Hours: {data.get('settings', {}).get('hours')}"
                )
        
    except Exception as e:
        log_test("Admin settings management", False, f"Exception: {str(e)}")

def test_product_availability():
    """Test GET /api/products/{id}/availability"""
    print("\n📅 Testing Product Availability")
    print("=" * 60)
    
    try:
        # Get a product first
        response = requests.get(f"{API_BASE}/products", timeout=10)
        if response.status_code != 200:
            log_test("Product availability", False, "Could not fetch products")
            return
        
        products = response.json().get('products', [])
        if len(products) == 0:
            log_test("Product availability", False, "No products available")
            return
        
        product = products[0]
        product_id = product['id']
        product_stock = product['stock']
        
        # Test availability without booking
        start_date = '2026-08-01'
        end_date = '2026-08-03'
        
        response = requests.get(
            f"{API_BASE}/products/{product_id}/availability?start={start_date}&end={end_date}",
            timeout=10
        )
        log_test(
            f"GET /api/products/{product_id}/availability - Status 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code != 200:
            return
        
        data = response.json()
        required_keys = ['stock', 'bookedQty', 'remaining', 'available', 'fullBookedDates']
        has_all_keys = all(key in data for key in required_keys)
        log_test(
            "Response has all required keys",
            has_all_keys,
            f"Keys: {list(data.keys())}"
        )
        
        log_test(
            "stock matches product stock",
            data.get('stock') == product_stock,
            f"Stock: {data.get('stock')}"
        )
        
        log_test(
            "fullBookedDates is an array",
            isinstance(data.get('fullBookedDates'), list),
            f"Full booked dates count: {len(data.get('fullBookedDates', []))}"
        )
        
        initial_booked_qty = data.get('bookedQty', 0)
        initial_remaining = data.get('remaining', 0)
        
        # Create an order that overlaps with the date range
        order_qty = min(2, product_stock)  # Order 2 or less if stock is low
        order_data = {
            'productId': product_id,
            'productName': product['name'],
            'qty': order_qty,
            'startDate': '2026-08-05',
            'endDate': '2026-08-07',
            'days': 2,
            'total': product['price'] * order_qty * 2
        }
        
        response = requests.post(
            f"{API_BASE}/orders",
            json=order_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        log_test(
            "Created test order for availability check",
            response.status_code == 200,
            f"Order qty: {order_qty}"
        )
        
        # Re-check availability for overlapping dates
        response = requests.get(
            f"{API_BASE}/products/{product_id}/availability?start=2026-08-05&end=2026-08-07",
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            new_booked_qty = data.get('bookedQty', 0)
            new_remaining = data.get('remaining', 0)
            
            log_test(
                "bookedQty increased after order",
                new_booked_qty >= order_qty,
                f"Booked qty: {new_booked_qty} (expected >= {order_qty})"
            )
            
            log_test(
                "remaining decreased after order",
                new_remaining == product_stock - new_booked_qty,
                f"Remaining: {new_remaining} (stock: {product_stock}, booked: {new_booked_qty})"
            )
            
            # If we ordered all stock, check if available is false
            if order_qty >= product_stock:
                log_test(
                    "available is false when fully booked",
                    data.get('available') == False,
                    f"Available: {data.get('available')}"
                )
                
                log_test(
                    "dates appear in fullBookedDates when fully booked",
                    len(data.get('fullBookedDates', [])) > 0,
                    f"Full booked dates: {len(data.get('fullBookedDates', []))}"
                )
        
    except Exception as e:
        log_test("Product availability", False, f"Exception: {str(e)}")

def test_gallery_public():
    """Test GET /api/gallery (public endpoint)"""
    print("\n🖼️  Testing GET /api/gallery (public)")
    print("=" * 60)
    
    try:
        response = requests.get(f"{API_BASE}/gallery", timeout=10)
        log_test(
            "GET /api/gallery - Status 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code != 200:
            return
        
        data = response.json()
        log_test(
            "Response has 'gallery' key",
            'gallery' in data,
            f"Keys: {list(data.keys())}"
        )
        
        if 'gallery' not in data:
            return
        
        gallery = data['gallery']
        log_test(
            "At least 9 gallery items returned",
            len(gallery) >= 9,
            f"Count: {len(gallery)}"
        )
        
        if len(gallery) > 0:
            item = gallery[0]
            required_fields = ['id', 'url', 'caption', 'category']
            has_all_fields = all(field in item for field in required_fields)
            log_test(
                "Gallery item has required fields",
                has_all_fields,
                f"Fields: {list(item.keys())}"
            )
            
            log_test(
                "Gallery item does not have _id field",
                '_id' not in item,
                "MongoDB _id properly stripped"
            )
        
    except Exception as e:
        log_test("GET /api/gallery", False, f"Exception: {str(e)}")

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
    print("🚀 Starting Backend API Tests - Admin & Availability Endpoints")
    print("=" * 60)
    
    # Run all NEW tests
    test_admin_login()
    test_admin_auth_guard()
    test_admin_stats()
    test_admin_crud_products()
    
    # Test CRUD for other collections
    test_admin_crud_collection('promos', {
        'title': 'TEST PROMO',
        'subtitle': 'Test promo subtitle',
        'discount': 10,
        'color': 'from-amber-500 to-yellow-600'
    })
    
    test_admin_crud_collection('reviews', {
        'name': 'Test User',
        'avatar': 'https://i.pravatar.cc/100?u=test',
        'rating': 5,
        'review': 'Test review from automated testing'
    })
    
    test_admin_crud_collection('packages', {
        'name': 'Test Package',
        'price': 100000,
        'subtitle': 'Test package subtitle',
        'items': ['Item 1', 'Item 2', 'Item 3']
    })
    
    test_admin_crud_collection('faqs', {
        'q': 'Test question?',
        'a': 'Test answer for automated testing'
    })
    
    test_admin_crud_collection('gallery', {
        'url': 'https://example.com/test.jpg',
        'caption': 'Test gallery item',
        'category': 'Test'
    })
    
    test_admin_orders()
    test_admin_settings()
    test_product_availability()
    test_gallery_public()
    
    # Print summary
    print_summary()
