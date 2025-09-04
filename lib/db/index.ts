import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
};

export type Location = {
  id: number;
  name: string;
  code: string;
  weekly_sales_target: number;
  food_cost_target: number;
  food_sales_ratio: number;
};

export type WeeklyData = {
  id: number;
  location_id: number;
  week_start: string;
  weekly_sales_forecast: number;
  created_by: number;
  daily_actuals?: DailyActual[];
};

export type DailyActual = {
  id: number;
  weekly_data_id: number;
  day_of_week: string;
  date: string;
  actual_sales: number | null;
  actual_purchasing: number | null;
};

// User functions
export async function authenticateUser(username: string, password: string): Promise<User | null> {
  try {
    const result = await sql<User>`
      SELECT id, username, email, role, is_active
      FROM users 
      WHERE username = ${username} AND is_active = true
    `;
    
    if (result.rows.length === 0) return null;
    
    const user = result.rows[0];
    
    // In a real app, check password hash
    // For now, we'll accept any password for demo
    // const validPassword = await bcrypt.compare(password, user.password_hash);
    // if (!validPassword) return null;
    
    return user;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

// Location functions
export async function getUserLocations(userId: number): Promise<Location[]> {
  try {
    const result = await sql<Location>`
      SELECT l.* 
      FROM locations l
      JOIN user_locations ul ON l.id = ul.location_id
      WHERE ul.user_id = ${userId} AND ul.can_view = true
      ORDER BY l.name
    `;
    return result.rows;
  } catch (error) {
    console.error('Error fetching user locations:', error);
    return [];
  }
}

export async function getLocationDetails(locationId: number, userId: number): Promise<any> {
  try {
    // Check access
    const accessResult = await sql`
      SELECT can_view FROM user_locations 
      WHERE user_id = ${userId} AND location_id = ${locationId}
    `;
    
    if (accessResult.rows.length === 0 || !accessResult.rows[0].can_view) {
      throw new Error('Access denied');
    }
    
    // Get location
    const locationResult = await sql<Location>`
      SELECT * FROM locations WHERE id = ${locationId}
    `;
    
    if (locationResult.rows.length === 0) {
      throw new Error('Location not found');
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
    
    return {
      ...locationResult.rows[0],
      sales_distribution: salesDist.rows,
      purchasing_distribution: purchDist.rows,
      vendors: vendors.rows,
    };
  } catch (error) {
    console.error('Error fetching location details:', error);
    throw error;
  }
}

// Weekly data functions
export async function getOrCreateWeeklyData(
  locationId: number,
  weekStart: string,
  userId: number
): Promise<WeeklyData> {
  try {
    // Check for existing
    let result = await sql<WeeklyData>`
      SELECT * FROM weekly_data 
      WHERE location_id = ${locationId} AND week_start = ${weekStart}
    `;
    
    if (result.rows.length === 0) {
      // Create new
      const location = await sql`
        SELECT weekly_sales_target FROM locations WHERE id = ${locationId}
      `;
      
      const insertResult = await sql`
        INSERT INTO weekly_data (location_id, week_start, weekly_sales_forecast, created_by)
        VALUES (${locationId}, ${weekStart}, ${location.rows[0].weekly_sales_target}, ${userId})
        RETURNING *
      `;
      
      const weeklyDataId = insertResult.rows[0].id;
      
      // Create daily actuals
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const startDate = new Date(weekStart + 'T12:00:00');
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        await sql`
          INSERT INTO daily_actuals (weekly_data_id, day_of_week, date)
          VALUES (${weeklyDataId}, ${days[i]}, ${dateStr})
        `;
      }
      
      result = await sql<WeeklyData>`
        SELECT * FROM weekly_data WHERE id = ${weeklyDataId}
      `;
    }
    
    // Get daily actuals
    const dailyActuals = await sql<DailyActual>`
      SELECT * FROM daily_actuals 
      WHERE weekly_data_id = ${result.rows[0].id}
      ORDER BY date
    `;
    
    return {
      ...result.rows[0],
      daily_actuals: dailyActuals.rows,
    };
  } catch (error) {
    console.error('Error getting/creating weekly data:', error);
    throw error;
  }
}

export async function updateWeeklyForecast(
  weeklyDataId: number,
  forecast: number,
  userId: number
): Promise<void> {
  try {
    await sql`
      UPDATE weekly_data 
      SET weekly_sales_forecast = ${forecast}, updated_at = NOW()
      WHERE id = ${weeklyDataId}
    `;
  } catch (error) {
    console.error('Error updating weekly forecast:', error);
    throw error;
  }
}

export async function updateDailyActual(
  dailyActualId: number,
  actualSales: number | null,
  actualPurchasing: number | null,
  userId: number
): Promise<void> {
  try {
    await sql`
      UPDATE daily_actuals 
      SET 
        actual_sales = ${actualSales},
        actual_purchasing = ${actualPurchasing},
        updated_by = ${userId},
        updated_at = NOW()
      WHERE id = ${dailyActualId}
    `;
  } catch (error) {
    console.error('Error updating daily actual:', error);
    throw error;
  }
}