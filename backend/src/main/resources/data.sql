INSERT INTO offer (title, category, description, cost_points, image_url, active, tier_level, start_date, end_date) VALUES
('Festive 15% Off','Lifestyle','Seasonal sale voucher for lifestyle category',900,'https://images.unsplash.com/photo-1542831371-29b0f74f9713',1,NULL,NULL,NULL),
('Travel Cab ₹150 Off','Travel','Comfortable rides at a discount',200,'https://images.unsplash.com/photo-1503376780353-7e6692767b70',1,'Bronze',NULL,NULL),
('Sportswear 12% Off','Sports','Gear up for workouts',450,'https://images.unsplash.com/photo-1517649763962-0c623066013b',1,'Silver',NULL,NULL),
('₹300 Grocery Wallet','Groceries','Stock your pantry with essentials.',350,'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38',1,'Bronze',NULL,NULL),
('Premium Dining ₹500 Off','Dining','Exclusive dining experience',800,'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',1,'Gold',NULL,NULL),
('Luxury Spa Package','Wellness','Relaxation and rejuvenation',1200,'https://images.unsplash.com/photo-1540555700478-4be289fbecef',1,'Platinum',NULL,NULL),
('Electronics 20% Off','Electronics','Latest gadgets at discounted prices',600,'https://images.unsplash.com/photo-1498049794561-7780e7231661',1,'Silver',NULL,NULL);

-- Basic user records for testing
INSERT INTO users (name, email, phone, password, role) VALUES
('Test User 1', 'user1@test.com', '9876543210', '$2a$10$dummyhashedpassword', 'USER'),
('Test User 2', 'user2@test.com', '9876543211', '$2a$10$dummyhashedpassword', 'USER'),
('Test User 3', 'user3@test.com', '9876543212', '$2a$10$dummyhashedpassword', 'USER'),
('Test User 4', 'user4@test.com', '9876543213', '$2a$10$dummyhashedpassword', 'USER'),
('Test User 5', 'user5@test.com', '9876543214', '$2a$10$dummyhashedpassword', 'USER'),
('Test User 6', 'user6@test.com', '9876543215', '$2a$10$dummyhashedpassword', 'USER'),
('Test User 7', 'user7@test.com', '9876543216', '$2a$10$dummyhashedpassword', 'USER'),
('Test User 8', 'user8@test.com', '9876543217', '$2a$10$dummyhashedpassword', 'USER'),
('Test User 9', 'user9@test.com', '9876543218', '$2a$10$dummyhashedpassword', 'USER'),
('Test User 10', 'user10@test.com', '9876543219', '$2a$10$dummyhashedpassword', 'USER');

-- Customer profiles for the users
INSERT INTO customer_profile (user_id, loyalty_tier, points_balance, lifetime_points, next_expiry, preferences, communication) VALUES
(1, 'Gold', 5000, 15000, DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'ELECTRONICS,SHOPPING', 'Email'),
(2, 'Silver', 2000, 8000, DATE_ADD(CURDATE(), INTERVAL 45 DAY), 'FOOD,DINING', 'SMS'),
(3, 'Bronze', 800, 3200, DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'GROCERY,TRAVEL', 'WhatsApp'),
(4, 'Platinum', 10000, 25000, DATE_ADD(CURDATE(), INTERVAL 15 DAY), 'ELECTRONICS,JEWELRY', 'Email'),
(5, 'Gold', 3500, 12000, DATE_ADD(CURDATE(), INTERVAL 25 DAY), 'FASHION,SHOPPING', 'Email'),
(6, 'Silver', 1500, 6000, DATE_ADD(CURDATE(), INTERVAL 40 DAY), 'BOOKS,FOOD', 'SMS'),
(7, 'Bronze', 600, 2400, DATE_ADD(CURDATE(), INTERVAL 55 DAY), 'TRAVEL,GROCERY', 'WhatsApp'),
(8, 'Gold', 4200, 14000, DATE_ADD(CURDATE(), INTERVAL 20 DAY), 'ELECTRONICS,FASHION', 'Email'),
(9, 'Silver', 1800, 7200, DATE_ADD(CURDATE(), INTERVAL 35 DAY), 'FOOD,DINING', 'SMS'),
(10, 'Bronze', 900, 3600, DATE_ADD(CURDATE(), INTERVAL 50 DAY), 'GROCERY,TRAVEL', 'WhatsApp');

-- Pre-flagged fraud transactions for testing (already processed) - REMOVED amount, currency, location, merchant_name, merchant_category as requested
INSERT INTO transactions (transaction_id, external_id, account_id, payment_method, description, risk_level, status, type, points_earned, points_redeemed, store, date, expiry, note, user_id, created_at, updated_at) VALUES
('TXN-PRE-FRAUD-001', 'RED-PRE-001', 'ACC-PRE-001', 'CARD', 'Blocked: Insufficient points balance', 'CRITICAL', 'BLOCKED', 'REDEMPTION', 0, 3000, 'Rolex Store', CURDATE(), NULL, 'Luxury watch purchase', 1, NOW(), NOW()),
('TXN-PRE-FRAUD-002', 'RED-PRE-002', 'ACC-PRE-002', 'CARD', 'Flagged: Multiple redemptions in short time (>5 in 10 min)', 'HIGH', 'REVIEW', 'REDEMPTION', 0, 800, 'Amazon UK', CURDATE(), NULL, 'International purchase', 2, NOW(), NOW()),
('TXN-PRE-FRAUD-003', 'RED-PRE-003', 'ACC-PRE-003', 'UPI', 'Flagged: Multiple redemptions in short time (>5 in 10 min)', 'HIGH', 'REVIEW', 'REDEMPTION', 0, 150, 'McDonalds', CURDATE(), NULL, 'Quick meal', 3, NOW(), NOW()),
('TXN-PRE-FRAUD-004', 'RED-PRE-004', 'ACC-PRE-004', 'CARD', 'Blocked: Insufficient points balance', 'CRITICAL', 'BLOCKED', 'REDEMPTION', 0, 2500, 'Gaming Hub', CURDATE(), NULL, 'Gaming console', 4, NOW(), NOW()),
('TXN-PRE-FRAUD-005', 'RED-PRE-005', 'ACC-PRE-005', 'CARD', 'Flagged: Multiple redemptions in short time (>5 in 10 min)', 'HIGH', 'REVIEW', 'REDEMPTION', 0, 450, 'Zara Paris', CURDATE(), NULL, 'Fashion items', 5, NOW(), NOW()),
('TXN-PRE-FRAUD-006', 'RED-PRE-006', 'ACC-PRE-006', 'CARD', 'Flagged: Multiple redemptions in short time (>5 in 10 min)', 'HIGH', 'REVIEW', 'REDEMPTION', 0, 200, 'Crossword', CURDATE(), NULL, 'Books purchase', 6, NOW(), NOW()),
('TXN-PRE-FRAUD-007', 'RED-PRE-007', 'ACC-PRE-007', 'CARD', 'Blocked: Insufficient points balance', 'CRITICAL', 'BLOCKED', 'REDEMPTION', 0, 1200, 'MakeMyTrip', CURDATE(), NULL, 'Flight booking', 7, NOW(), NOW()),
('TXN-PRE-FRAUD-008', 'RED-PRE-008', 'ACC-PRE-008', 'CARD', 'Flagged: Multiple redemptions in short time (>5 in 10 min)', 'HIGH', 'REVIEW', 'REDEMPTION', 0, 350, 'Currys PC World', CURDATE(), NULL, 'Laptop purchase', 8, NOW(), NOW()),
('TXN-PRE-FRAUD-009', 'RED-PRE-009', 'ACC-PRE-009', 'UPI', 'Flagged: Multiple redemptions in short time (>5 in 10 min)', 'HIGH', 'REVIEW', 'REDEMPTION', 0, 90, 'Starbucks', CURDATE(), NULL, 'Coffee and snacks', 9, NOW(), NOW()),
('TXN-PRE-FRAUD-010', 'RED-PRE-010', 'ACC-PRE-010', 'CARD', 'Blocked: Insufficient points balance', 'CRITICAL', 'BLOCKED', 'REDEMPTION', 0, 1800, 'Croma', CURDATE(), NULL, 'Refrigerator purchase', 10, NOW(), NOW());
