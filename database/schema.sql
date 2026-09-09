-- ==============================================================================
-- BankGuard AI: PostgreSQL Enterprise Relational Database Schema
-- Architecture: Raw Ingestion -> Clean Customers -> ML Predictions -> Optimization -> CRM
-- ==============================================================================

-- 1. Raw Customers (Source of Truth - Never Mutated by ML)
CREATE TABLE IF NOT EXISTS raw_customers (
    id SERIAL PRIMARY KEY,
    year INT NOT NULL DEFAULT 2025,
    customer_id INT NOT NULL UNIQUE,
    surname VARCHAR(100) NOT NULL,
    credit_score INT NOT NULL,
    geography VARCHAR(50) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    age INT NOT NULL,
    tenure INT NOT NULL,
    balance NUMERIC(15, 2) NOT NULL,
    num_of_products INT NOT NULL,
    has_cr_card SMALLINT NOT NULL,
    is_active_member SMALLINT NOT NULL,
    estimated_salary NUMERIC(15, 2) NOT NULL,
    exited SMALLINT NOT NULL,
    ingestion_id VARCHAR(64) NOT NULL DEFAULT 'INIT_2025_001',
    ingested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Processed Customer Features (Clean layer with derived groupings)
CREATE TABLE IF NOT EXISTS customer_features (
    customer_id INT PRIMARY KEY REFERENCES raw_customers(customer_id),
    age_group VARCHAR(20) NOT NULL,
    credit_score_band VARCHAR(30) NOT NULL,
    tenure_group VARCHAR(30) NOT NULL,
    balance_segment VARCHAR(40) NOT NULL,
    engagement_segment VARCHAR(40) NOT NULL,
    product_segment VARCHAR(40) NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Churn Predictions (Model-generated probabilities & SHAP factors)
CREATE TABLE IF NOT EXISTS churn_predictions (
    prediction_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES raw_customers(customer_id),
    churn_probability NUMERIC(6, 4) NOT NULL,
    risk_score INT NOT NULL,
    risk_category VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
    model_version VARCHAR(50) NOT NULL,
    predicted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    shap_top_positive_factors JSONB,
    shap_top_negative_factors JSONB
);

-- 4. Customer Segments
CREATE TABLE IF NOT EXISTS customer_segments (
    segment_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    customer_count INT NOT NULL,
    churn_rate NUMERIC(5, 2) NOT NULL,
    average_balance NUMERIC(15, 2) NOT NULL,
    recommended_action TEXT
);

-- 5. Optimization Results (OR-Tools Knapsack Allocations)
CREATE TABLE IF NOT EXISTS optimization_results (
    optimization_id VARCHAR(64) PRIMARY KEY,
    scenario_name VARCHAR(100) NOT NULL,
    target_capacity INT NOT NULL,
    total_budget NUMERIC(12, 2) NOT NULL,
    selected_customer_count INT NOT NULL,
    total_risk_reduced NUMERIC(6, 2) NOT NULL,
    estimated_protected_balance NUMERIC(15, 2) NOT NULL,
    parameters JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. CRM Cases (Operational Retention Workflows)
CREATE TABLE IF NOT EXISTS crm_cases (
    case_id VARCHAR(64) PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES raw_customers(customer_id),
    priority VARCHAR(20) NOT NULL, -- CRITICAL, HIGH, MEDIUM, LOW
    assigned_officer VARCHAR(100) NOT NULL,
    status VARCHAR(30) NOT NULL, -- OPEN, IN_PROGRESS, CONTACTED, RESOLVED, CLOSED
    recommended_action TEXT NOT NULL,
    follow_up_date DATE NOT NULL,
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Model Versions Registry
CREATE TABLE IF NOT EXISTS model_versions (
    model_name VARCHAR(100) NOT NULL,
    version VARCHAR(50) NOT NULL,
    training_date DATE NOT NULL,
    accuracy NUMERIC(5, 2) NOT NULL,
    precision_score NUMERIC(5, 2) NOT NULL,
    recall_score NUMERIC(5, 2) NOT NULL,
    f1_score NUMERIC(5, 2) NOT NULL,
    roc_auc NUMERIC(5, 3) NOT NULL,
    status VARCHAR(30) NOT NULL,
    PRIMARY KEY (model_name, version)
);

-- 8. Data Ingestion & Quality Logs
CREATE TABLE IF NOT EXISTS data_quality_logs (
    log_id SERIAL PRIMARY KEY,
    dataset_name VARCHAR(100) NOT NULL,
    row_count INT NOT NULL,
    missing_count INT NOT NULL,
    duplicate_count INT NOT NULL,
    validation_status VARCHAR(20) NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Audit Logs (Security & Compliance)
CREATE TABLE IF NOT EXISTS audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_email VARCHAR(100) NOT NULL,
    user_role VARCHAR(30) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
