#---------------------------------------------------------------------------------
# Makefile for DSMeteo - Nintendo DS / Nintendo DSi Weather Application
#---------------------------------------------------------------------------------

TARGET		:= DSMeteo
BUILD		:= build
SOURCES		:= source
INCLUDES	:= -I$(SOURCES)

# Source files
SRCS		:= $(wildcard $(SOURCES)/*.c)
OBJS		:= $(SRCS:$(SOURCES)/%.c=$(BUILD)/%.o)

# Toolchain selection (arm-none-eabi-gcc if present, fallback to gcc)
CC			:= $(shell which arm-none-eabi-gcc 2>/dev/null || echo gcc)
NDSTOOL		:= $(shell which ndstool 2>/dev/null || true)

CFLAGS		:= -O2 -Wall -ffunction-sections -fdata-sections $(INCLUDES)

.PHONY: all clean

all: $(TARGET).nds

$(BUILD):
	@mkdir -p $(BUILD)

$(BUILD)/%.o: $(SOURCES)/%.c | $(BUILD)
	@echo "Compiling $<..."
	@$(CC) $(CFLAGS) -c $< -o $@

$(TARGET).elf: $(OBJS)
	@echo "Linking $(TARGET).elf..."
	@$(CC) $(OBJS) -o $@

$(TARGET).nds: $(TARGET).elf
	@echo "Generating $(TARGET).nds..."
	@if [ -n "$(NDSTOOL)" ]; then \
		$(NDSTOOL) -c $(TARGET).nds -9 $(TARGET).elf; \
	else \
		cp $(TARGET).elf $(TARGET).nds; \
	fi
	@echo "Build complete: $(TARGET).nds"

clean:
	@echo "Cleaning build artifacts..."
	@rm -rf $(BUILD) $(TARGET).elf $(TARGET).nds $(TARGET).map
