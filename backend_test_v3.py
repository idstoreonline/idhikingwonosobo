#!/usr/bin/env python3
"""
Backend API Test Suite for ID Hiking Rent Wonosobo - V3 NEW ENDPOINTS ONLY
Tests ONLY the NEW v3 endpoints (slug lookup, auto-backfill, notifications, etc.)
"""

import requests
import json
import sys

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
ADMIN_TOKEN = ADMIN_PASSWORD  # We know from previous tests this is the token

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

def test_slug_lookup():
    """Test GET /api/products/slug/:slug (NEW v3 endpoint)"""
    print("\n🔍 Testing Product Slug Lookup (NEW v3)")
    print("=" * 60)
    
    try:
        # Test 1: GET /api/products/slug/carrier-consina-60l → 200 with product + related
        response = requests.get(
            f"{API_BASE}/products/slug/carrier-consina-60l",
            timeout=10
        )
        log_test(
            "GET /api/products/slug/carrier-consina-60l - Status 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code == 200:
            data = response.json()
            
            # Check response structure
            log_test(
                "Response has 'product' and 'related' keys",
                'product' in data and 'related' in data,
                f"Keys: {list(data.keys())}"
            )
            
            if 'product' in data:
                product = data['product']
                
                # Check slug matches
                log_test(
                    "product.slug equals 'carrier-consina-60l'",
                    product.get('slug') == 'carrier-consina-60l',
                    f"Slug: {product.get('slug')}"
                )
                
                # Check product has images array
                log_test(
                    "product has images array with at least 1 item",
                    isinstance(product.get('images'), list) and len(product.get('images', [])) >= 1,
                    f"Images count: {len(product.get('images', []))}"
                )
                
                # Check product has pricingTiers array
                log_test(
                    "product has pricingTiers array with at least 3 entries",
                    isinstance(product.get('pricingTiers'), list) and len(product.get('pricingTiers', [])) >= 3,
                    f"PricingTiers count: {len(product.get('pricingTiers', []))}"
                )
                
                # Check pricingTiers structure
                if isinstance(product.get('pricingTiers'), list) and len(product.get('pricingTiers', [])) > 0:
                    tier = product['pricingTiers'][0]
                    log_test(
                        "pricingTiers entries have {days, price} structure",
                        'days' in tier and 'price' in tier and isinstance(tier['days'], int) and isinstance(tier['price'], (int, float)),
                        f"First tier: {tier}"
                    )
            
            if 'related' in data:
                log_test(
                    "related is an array",
                    isinstance(data['related'], list),
                    f"Related count: {len(data.get('related', []))}"
                )
        
        # Test 2: GET /api/products/slug/does-not-exist → 404
        response = requests.get(
            f"{API_BASE}/products/slug/does-not-exist",
            timeout=10
        )
        log_test(
            "GET /api/products/slug/does-not-exist - Status 404",
            response.status_code == 404,
            f"Status: {response.status_code}"
        )
        
        if response.status_code == 404:
            data = response.json()
            log_test(
                "404 response has error field",
                'error' in data,
                f"Error: {data.get('error')}"
            )
        
        # Test 3: GET /api/products/slug/tenda-dome-eiger-4p → 200
        response = requests.get(
            f"{API_BASE}/products/slug/tenda-dome-eiger-4p",
            timeout=10
        )
        log_test(
            "GET /api/products/slug/tenda-dome-eiger-4p - Status 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code == 200:
            data = response.json()
            log_test(
                "Response has product with correct slug",
                data.get('product', {}).get('slug') == 'tenda-dome-eiger-4p',
                f"Slug: {data.get('product', {}).get('slug')}"
            )
        
    except Exception as e:
        log_test("Product slug lookup", False, f"Exception: {str(e)}")

def test_auto_backfill():
    """Test auto-backfill of slug, images, pricingTiers (NEW v3)"""
    print("\n🔄 Testing Auto-Backfill (slug, images, pricingTiers) (NEW v3)")
    print("=" * 60)
    
    try:
        # GET /api/products → EVERY product must have slug, images, pricingTiers
        response = requests.get(f"{API_BASE}/products", timeout=10)
        log_test(
            "GET /api/products - Status 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code != 200:
            return
        
        data = response.json()
        products = data.get('products', [])
        
        log_test(
            "At least 1 product returned",
            len(products) > 0,
            f"Products count: {len(products)}"
        )
        
        if len(products) == 0:
            return
        
        # Check EVERY product has slug, images, pricingTiers
        all_have_slug = True
        all_have_images = True
        all_have_pricing_tiers = True
        
        products_without_slug = []
        products_without_images = []
        products_without_pricing = []
        
        for product in products:
            # Check slug
            if not product.get('slug') or not isinstance(product.get('slug'), str) or len(product.get('slug', '')) == 0:
                all_have_slug = False
                products_without_slug.append(product.get('name', product.get('id')))
            
            # Check images
            if not isinstance(product.get('images'), list) or len(product.get('images', [])) < 1:
                all_have_images = False
                products_without_images.append(product.get('name', product.get('id')))
            
            # Check pricingTiers
            if not isinstance(product.get('pricingTiers'), list) or len(product.get('pricingTiers', [])) < 3:
                all_have_pricing_tiers = False
                products_without_pricing.append(product.get('name', product.get('id')))
        
        log_test(
            "ALL products have slug (non-empty string)",
            all_have_slug,
            f"Products without slug: {products_without_slug}" if not all_have_slug else f"All {len(products)} products have slug"
        )
        
        log_test(
            "ALL products have images array with at least 1 item",
            all_have_images,
            f"Products without images: {products_without_images}" if not all_have_images else f"All {len(products)} products have images"
        )
        
        log_test(
            "ALL products have pricingTiers array with at least 3 entries",
            all_have_pricing_tiers,
            f"Products without pricingTiers: {products_without_pricing}" if not all_have_pricing_tiers else f"All {len(products)} products have pricingTiers"
        )
        
        # Check structure of pricingTiers for first product
        if len(products) > 0 and isinstance(products[0].get('pricingTiers'), list) and len(products[0].get('pricingTiers', [])) > 0:
            tier = products[0]['pricingTiers'][0]
            log_test(
                "pricingTiers entries have correct structure {days: number, price: number}",
                'days' in tier and 'price' in tier and isinstance(tier['days'], int) and isinstance(tier['price'], (int, float)),
                f"Sample tier: {tier}"
            )
        
    except Exception as e:
        log_test("Auto-backfill", False, f"Exception: {str(e)}")

def test_order_creates_notification():
    """Test that POST /api/orders creates notification (NEW v3)"""
    print("\n🔔 Testing Order Creates Notification (NEW v3)")
    print("=" * 60)
    
    try:
        # Get a product first
        response = requests.get(f"{API_BASE}/products", timeout=10)
        if response.status_code != 200:
            log_test("Order creates notification", False, "Could not fetch products")
            return
        
        products = response.json().get('products', [])
        if len(products) == 0:
            log_test("Order creates notification", False, "No products available")
            return
        
        product = products[0]
        product_id = product['id']
        
        # Create order with specific productName for testing
        order_data = {
            'productId': product_id,
            'productName': 'TEST NOTIF',
            'qty': 1,
            'startDate': '2026-09-01',
            'endDate': '2026-09-02',
            'days': 1,
            'total': 30000
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
        
        # Check response includes order and notification
        log_test(
            "Response has 'order' key",
            'order' in data,
            f"Keys: {list(data.keys())}"
        )
        
        log_test(
            "Response has 'notification' key",
            'notification' in data,
            f"Notification: {data.get('notification')}"
        )
        
        # notification may be { skipped: true } if no FONNTE_TOKEN
        if 'notification' in data:
            notif = data['notification']
            if notif.get('skipped'):
                log_test(
                    "Notification skipped (no FONNTE_TOKEN) - expected behavior",
                    True,
                    "FONNTE_TOKEN not set, notification skipped"
                )
            else:
                log_test(
                    "Notification sent via Fonnte",
                    'ok' in notif or 'error' in notif,
                    f"Notification result: {notif}"
                )
        
        # Now check if notification was created in DB via GET /api/admin/notifications
        headers = {'x-admin-token': ADMIN_TOKEN}
        response = requests.get(
            f"{API_BASE}/admin/notifications",
            headers=headers,
            timeout=10
        )
        
        log_test(
            "GET /api/admin/notifications - Status 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code == 200:
            data = response.json()
            items = data.get('items', [])
            
            # Find notification with title containing "TEST NOTIF"
            test_notif = None
            for item in items:
                if 'TEST NOTIF' in item.get('title', ''):
                    test_notif = item
                    break
            
            log_test(
                "NEW_ORDER notification exists with title containing 'TEST NOTIF'",
                test_notif is not None,
                f"Found notification: {test_notif.get('title') if test_notif else 'Not found'}"
            )
            
            if test_notif:
                log_test(
                    "Notification has type 'NEW_ORDER'",
                    test_notif.get('type') == 'NEW_ORDER',
                    f"Type: {test_notif.get('type')}"
                )
            
            # Check unread count
            unread = data.get('unread', 0)
            log_test(
                "unread count > 0",
                unread > 0,
                f"Unread: {unread}"
            )
        
    except Exception as e:
        log_test("Order creates notification", False, f"Exception: {str(e)}")

def test_notifications_management():
    """Test admin notifications management (NEW v3)"""
    print("\n📬 Testing Notifications Management (NEW v3)")
    print("=" * 60)
    
    if not ADMIN_TOKEN:
        log_test("Notifications management", False, "No admin token available")
        return
    
    headers = {'x-admin-token': ADMIN_TOKEN}
    
    try:
        # Test 1: GET /api/admin/notifications → { items: [...], unread: N }
        response = requests.get(
            f"{API_BASE}/admin/notifications",
            headers=headers,
            timeout=10
        )
        log_test(
            "GET /api/admin/notifications - Status 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code != 200:
            return
        
        data = response.json()
        
        log_test(
            "Response has 'items' and 'unread' keys",
            'items' in data and 'unread' in data,
            f"Keys: {list(data.keys())}"
        )
        
        items = data.get('items', [])
        initial_unread = data.get('unread', 0)
        
        log_test(
            "items is an array",
            isinstance(items, list),
            f"Items count: {len(items)}"
        )
        
        log_test(
            "unread is a number",
            isinstance(initial_unread, int),
            f"Unread: {initial_unread}"
        )
        
        # Test 2: POST /api/admin/notifications/read-all → { ok: true }
        response = requests.post(
            f"{API_BASE}/admin/notifications/read-all",
            headers=headers,
            timeout=10
        )
        log_test(
            "POST /api/admin/notifications/read-all - Status 200",
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
        
        # Test 3: GET /api/admin/notifications again → unread should be 0
        response = requests.get(
            f"{API_BASE}/admin/notifications",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            new_unread = data.get('unread', 0)
            log_test(
                "unread count is 0 after read-all",
                new_unread == 0,
                f"Unread: {new_unread}"
            )
        
        # Test 4: DELETE /api/admin/notifications/{id} → { ok: true }
        if len(items) > 0:
            notif_id = items[0].get('id')
            response = requests.delete(
                f"{API_BASE}/admin/notifications/{notif_id}",
                headers=headers,
                timeout=10
            )
            log_test(
                f"DELETE /api/admin/notifications/{notif_id} - Status 200",
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
            
            # Test 5: GET /api/admin/notifications again → item should be gone
            response = requests.get(
                f"{API_BASE}/admin/notifications",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                new_items = data.get('items', [])
                item_ids = [item.get('id') for item in new_items]
                log_test(
                    "Deleted notification no longer in list",
                    notif_id not in item_ids,
                    f"Notification deleted successfully"
                )
        
        # Test 6: Verify unauthorized (no header) → 401
        response = requests.get(
            f"{API_BASE}/admin/notifications",
            timeout=10
        )
        log_test(
            "GET /api/admin/notifications without token - Status 401",
            response.status_code == 401,
            f"Status: {response.status_code}"
        )
        
    except Exception as e:
        log_test("Notifications management", False, f"Exception: {str(e)}")

def test_admin_product_with_pricing_tiers():
    """Test POST /api/admin/products with pricingTiers (NEW v3)"""
    print("\n📦 Testing Admin Product with pricingTiers (NEW v3)")
    print("=" * 60)
    
    if not ADMIN_TOKEN:
        log_test("Admin product with pricingTiers", False, "No admin token available")
        return
    
    headers = {'x-admin-token': ADMIN_TOKEN, 'Content-Type': 'application/json'}
    created_id = None
    
    try:
        # POST /api/admin/products with explicit pricingTiers
        new_product = {
            'name': 'Slug Test Item ABC',
            'category': 'Aksesoris',
            'size': 'M',
            'stock': 3,
            'price': 10000,
            'images': ['https://example.com/a.jpg', 'https://example.com/b.jpg'],
            'pricingTiers': [
                {'days': 1, 'price': 10000},
                {'days': 3, 'price': 25000},
                {'days': 7, 'price': 50000}
            ]
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
        
        if response.status_code != 200:
            return
        
        data = response.json()
        
        log_test(
            "Response has 'item' key",
            'item' in data,
            f"Keys: {list(data.keys())}"
        )
        
        if 'item' not in data:
            return
        
        item = data['item']
        created_id = item.get('id')
        
        # Check slug is auto-generated
        log_test(
            "item.slug equals 'slug-test-item-abc'",
            item.get('slug') == 'slug-test-item-abc',
            f"Slug: {item.get('slug')}"
        )
        
        # Check images array
        log_test(
            "item.images is array of 2 URLs",
            isinstance(item.get('images'), list) and len(item.get('images', [])) == 2,
            f"Images: {item.get('images')}"
        )
        
        if isinstance(item.get('images'), list) and len(item.get('images', [])) == 2:
            log_test(
                "images[0] is 'https://example.com/a.jpg'",
                item['images'][0] == 'https://example.com/a.jpg',
                f"First image: {item['images'][0]}"
            )
            log_test(
                "images[1] is 'https://example.com/b.jpg'",
                item['images'][1] == 'https://example.com/b.jpg',
                f"Second image: {item['images'][1]}"
            )
        
        # Check pricingTiers array
        log_test(
            "item.pricingTiers is array of 3 tiers",
            isinstance(item.get('pricingTiers'), list) and len(item.get('pricingTiers', [])) == 3,
            f"PricingTiers count: {len(item.get('pricingTiers', []))}"
        )
        
        if isinstance(item.get('pricingTiers'), list) and len(item.get('pricingTiers', [])) == 3:
            tiers = item['pricingTiers']
            log_test(
                "pricingTiers[0] is {days:1, price:10000}",
                tiers[0].get('days') == 1 and tiers[0].get('price') == 10000,
                f"Tier 0: {tiers[0]}"
            )
            log_test(
                "pricingTiers[1] is {days:3, price:25000}",
                tiers[1].get('days') == 3 and tiers[1].get('price') == 25000,
                f"Tier 1: {tiers[1]}"
            )
            log_test(
                "pricingTiers[2] is {days:7, price:50000}",
                tiers[2].get('days') == 7 and tiers[2].get('price') == 50000,
                f"Tier 2: {tiers[2]}"
            )
        
        # Test GET /api/products/slug/slug-test-item-abc → returns the created product
        response = requests.get(
            f"{API_BASE}/products/slug/slug-test-item-abc",
            timeout=10
        )
        log_test(
            "GET /api/products/slug/slug-test-item-abc - Status 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        if response.status_code == 200:
            data = response.json()
            log_test(
                "Retrieved product matches created product",
                data.get('product', {}).get('id') == created_id,
                f"Product ID: {data.get('product', {}).get('id')}"
            )
        
        # Cleanup: DELETE /api/admin/products/{id}
        if created_id:
            response = requests.delete(
                f"{API_BASE}/admin/products/{created_id}",
                headers=headers,
                timeout=10
            )
            log_test(
                f"DELETE /api/admin/products/{created_id} (cleanup) - Status 200",
                response.status_code == 200,
                f"Status: {response.status_code}"
            )
        
    except Exception as e:
        log_test("Admin product with pricingTiers", False, f"Exception: {str(e)}")

def print_summary():
    """Print test summary"""
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY - V3 NEW ENDPOINTS")
    print("=" * 60)
    print(f"✅ Passed: {test_results['passed']}")
    print(f"❌ Failed: {test_results['failed']}")
    print(f"📈 Total:  {test_results['passed'] + test_results['failed']}")
    
    if test_results['failed'] > 0:
        print("\n❌ FAILED TESTS:")
        for error in test_results['errors']:
            print(f"   • {error}")
        print("\n⚠️  V3 BACKEND TESTS FAILED")
        sys.exit(1)
    else:
        print("\n✅ ALL V3 BACKEND TESTS PASSED!")
        sys.exit(0)

if __name__ == "__main__":
    print("🚀 Starting Backend API Tests - V3 NEW ENDPOINTS ONLY")
    print("=" * 60)
    print("Testing ONLY the NEW v3 endpoints:")
    print("  1. Product slug lookup")
    print("  2. Auto-backfill (slug, images, pricingTiers)")
    print("  3. Order creates notification")
    print("  4. Notifications management")
    print("  5. Admin product with pricingTiers")
    print("=" * 60)
    
    # Run all NEW v3 tests
    test_slug_lookup()
    test_auto_backfill()
    test_order_creates_notification()
    test_notifications_management()
    test_admin_product_with_pricing_tiers()
    
    # Print summary
    print_summary()
