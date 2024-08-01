package com.foodgo.model;

public enum ORDER_STATUS {

    PENDING,
    CONFIRMED,
    DELIVERING,
    COMPLETED,
    CANCELLED,
    CANCELLED_REFUNDED;

    private ORDER_STATUS[] next;

    public ORDER_STATUS[] getNext() {
        return next;
    }

    static {
        PENDING.next = new ORDER_STATUS[]{CONFIRMED,CANCELLED};
        CONFIRMED.next = new ORDER_STATUS[]{DELIVERING, PENDING,CANCELLED}; // Allow going back to PENDING
        DELIVERING.next = new ORDER_STATUS[]{COMPLETED, CANCELLED, CONFIRMED}; // Allow going back to CONFIRMED
        COMPLETED.next = new ORDER_STATUS[]{DELIVERING,CANCELLED}; // Allow going back to DELIVERING
        CANCELLED.next = new ORDER_STATUS[]{CANCELLED_REFUNDED, DELIVERING}; // Allow going back to DELIVERING
        CANCELLED_REFUNDED.next = new ORDER_STATUS[]{}; // No next status
    }

    public boolean canTransitionTo(ORDER_STATUS nextStatus) {
        for (ORDER_STATUS status : this.next) {
            if (status == nextStatus) {
                return true;
            }
        }
        return false;
    }
}
