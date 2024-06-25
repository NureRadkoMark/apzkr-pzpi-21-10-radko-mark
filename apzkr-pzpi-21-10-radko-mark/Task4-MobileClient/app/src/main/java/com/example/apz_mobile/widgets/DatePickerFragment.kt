package com.example.apz_mobile.widgets

import android.app.DatePickerDialog
import android.app.Dialog
import android.os.Bundle
import androidx.fragment.app.DialogFragment
import java.util.*

class DatePickerFragment(private val listener: (year: Int, month: Int, day: Int, hourOfDay: Int, minute: Int) -> Unit) : DialogFragment() {

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        // Use the current date as the default date and time in the picker
        val c = Calendar.getInstance()
        val year = c.get(Calendar.YEAR)
        val month = c.get(Calendar.MONTH)
        val day = c.get(Calendar.DAY_OF_MONTH)
        val hour = c.get(Calendar.HOUR_OF_DAY)
        val minute = c.get(Calendar.MINUTE)

        // Create a new instance of DatePickerDialog and return it
        return DatePickerDialog(requireContext(), { _, selectedYear, selectedMonth, selectedDay ->
            // Show time picker after date is set
            TimePickerFragment { hourOfDay, minute ->
                listener(selectedYear, selectedMonth, selectedDay, hourOfDay, minute)
            }.show(parentFragmentManager, "timePicker")
        }, year, month, day)
    }
}
