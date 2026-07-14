# Costing Engine

Owns the four-layer cost model:
Supplier Cost → Landed Cost → Company Cost → Selling Price.
Cost components (freight, insurance, duty, ...) are configurable per
company and may be a percentage, fixed amount, per-unit amount, or
formula. Calculated values are never overwritten — full costing history
is preserved.
