const supabase = require("../helpers/supabase");

class Measurement {
  static async create(measurementData) {
    const { data, error } = await supabase
      .from("measurements")
      .insert([
        {
          user_id: measurementData.userId,
          decibels: measurementData.decibels,
          latitude: measurementData.latitude,
          longitude: measurementData.longitude,
          location_name: measurementData.locationName,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    return data[0];
  }

  static async findByUserId(userId, limit = 100) {
    const { data, error } = await supabase
      .from("measurements")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  static async findAll(limit = 100) {
    const { data, error } = await supabase
      .from("measurements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
}

module.exports = Measurement;
