package com.example.apz_mobile.adapters

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.example.apz_mobile.R
import com.example.apz_mobile.models.Department

class DepartmentAdapter(
    private val context: Context,
    private val departments: List<Department>,
    private val onItemClick: (Department) -> Unit
) : RecyclerView.Adapter<DepartmentAdapter.ViewHolder>() {

    private var selectedPosition = -1

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(context).inflate(R.layout.item_department, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val department = departments[position]
        holder.bind(department, position)

        holder.itemView.setBackgroundColor(
            if (position == selectedPosition)
                ContextCompat.getColor(context, R.color.selectedItem)
            else
                ContextCompat.getColor(context, android.R.color.transparent)
        )

        holder.itemView.setOnClickListener {
            onItemClick(department)
            setSelectedPosition(holder.adapterPosition)
        }
    }

    override fun getItemCount(): Int {
        return departments.size
    }

    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val nameTextView: TextView = itemView.findViewById(R.id.departmentNameTextView)
        private val addressTextView: TextView = itemView.findViewById(R.id.departmentAddressTextView)
        private val phoneTextView: TextView = itemView.findViewById(R.id.departmentPhoneTextView)
        private val infoTextView: TextView = itemView.findViewById(R.id.departmentInfoTextView)
        private val workingHoursTextView: TextView = itemView.findViewById(R.id.departmentWorkingHoursTextView)

        fun bind(department: Department, position: Int) {
            nameTextView.text = department.Name
            addressTextView.text = "Address: ${department.Address}"
            phoneTextView.text = "Phone: ${department.PhoneNumber}"
            infoTextView.text = "Info: ${department.Info}"
            workingHoursTextView.text = "Working Hours: ${department.StartWorkingTime} - ${department.EndWorkingTime}"
        }
    }

    private fun setSelectedPosition(position: Int) {
        if (selectedPosition != position) {
            val previousSelected = selectedPosition
            selectedPosition = position
            notifyItemChanged(previousSelected)
            notifyItemChanged(selectedPosition)
        }
    }
}

