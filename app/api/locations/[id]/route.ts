import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

interface UserPayload {
  id: number;
  username: string;
  role: string;
}

async function getUserFromToken(): Promise<UserPayload | null> {
  const token = cookies().get('auth-token')?.value;
  if (!token) return null;
  
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as UserPayload;
  } catch {
    return null;
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const locationId = parseInt(params.id);
    
    // Check access
    const access = await sql`
      SELECT can_view FROM user_locations 
      WHERE user_id = ${user.id} AND location_id = ${locationId}
    `;
    
    if (access.rows.length === 0 || !access.rows[0].can_view) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    
    // Get location details
    const location = await sql`
      SELECT * FROM locations WHERE id = ${locationId}
    `;
    
    if (location.rows.length === 0) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }
    
    // Get distributions
    const salesDist = await sql`
      SELECT day_of_week, percentage 
      FROM sales_distribution 
      WHERE location_id = ${locationId}
      ORDER BY CASE day_of_week 
        WHEN 'Monday' THEN 1 
        WHEN 'Tuesday' THEN 2 
        WHEN 'Wednesday' THEN 3 
        WHEN 'Thursday' THEN 4 
        WHEN 'Friday' THEN 5 
        WHEN 'Saturday' THEN 6 
        WHEN 'Sunday' THEN 7 
      END
    `;
    
    const purchDist = await sql`
      SELECT day_of_week, percentage 
      FROM purchasing_distribution 
      WHERE location_id = ${locationId}
      ORDER BY CASE day_of_week 
        WHEN 'Monday' THEN 1 
        WHEN 'Tuesday' THEN 2 
        WHEN 'Wednesday' THEN 3 
        WHEN 'Thursday' THEN 4 
        WHEN 'Friday' THEN 5 
        WHEN 'Saturday' THEN 6 
        WHEN 'Sunday' THEN 7 
      END
    `;
    
    const vendors = await sql`
      SELECT vendor_name, percentage 
      FROM vendor_config 
      WHERE location_id = ${locationId} AND is_active = true
    `;
    
    return NextResponse.json({
      ...location.rows[0],
      sales_distribution: salesDist.rows,
      purchasing_distribution: purchDist.rows,
      vendors: vendors.rows
    });
  } catch (error) {
    console.error('Error fetching location:', error);
    return NextResponse.json({ error: 'Failed to fetch location' }, { status: 500 });
  }
}