# Steakz MIS Web Portal - Short Lab Report

## Review of Existing Information Systems

In many restaurant chains, management information is spread across separate tills, paper stock sheets, spreadsheets, staff rotas, and supplier records. This creates duplicated data entry, slow reporting, and inconsistent information between branches. Managers may know local sales totals, but head office often lacks a timely view of menu performance, low-stock risks, branch comparisons, and staff activity.

For Steakz, the existing information system problem is likely to include fragmented sales records, limited central visibility, delayed inventory updates, and manual reporting. These weaknesses reduce the quality of decision-making because managers cannot easily compare branches, identify fast-moving products, or respond to stock shortages before service is affected.

## Recommended Improvements

The recommended improvement is a web-based Management Information System with centralised data for users, branches, menu items, inventory, orders, and management reports. The system should provide different access levels so that Admin users can control master data, Managers can manage branch operations, and Staff can record operational activity without seeing sensitive information.

The portal should also include dashboard summaries, low-stock alerts, branch performance tables, and visual reporting charts. These features turn raw transaction data into useful management information.

## Justification of Improvements

Centralising data improves accuracy because staff and managers use the same source of information. Role-based access improves security by limiting each user to the information and actions needed for their job. Reporting dashboards improve decision-making by showing sales trends, product mix, order volume, revenue, and low-stock items.

For DATASAP and Steakz, this improves operational control, reduces manual reporting effort, supports quicker management decisions, and gives head office better evidence for branch performance reviews.

## Critical Review of the Developed Portal

The developed Steakz MIS Web Portal meets the assignment scenario by providing role-based dashboards, simple CRUD operations, seeded restaurant data, and reporting pages suitable for screenshots. It uses Node.js, Express, Prisma, SQLite, Pug templates, sessions, and hashed passwords, so it matches the style of a student Prisma web application.

The main strengths are the clear role separation, simple navigation, responsive layout, and screenshot-friendly dashboards. The portal also links operational input pages, such as orders and inventory, to management outputs, such as KPI cards and charts.

Limitations remain. The project is designed for lab demonstration rather than full production use. A live system would need more detailed audit logs, stronger form validation, password reset functionality, server-side pagination, richer order item handling, exportable reports, and deeper integration with POS and supplier systems. Even with these limits, the portal is suitable as a functional MIS prototype for the Steakz scenario.
