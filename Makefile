#---------------------------------------------------------------------------------
# Makefile for DSMeteo - Nintendo DS / Nintendo DSi Weather Application
# Uses BlocksDS / devkitARM and libnds
#---------------------------------------------------------------------------------

TARGET		:= DSMeteo
BUILD		:= build
SOURCES		:= source
DATA		:= data
INCLUDES	:= include source

# Enable Nintendo DSi (TWL) extended features
DSi_MODE	:= 1

# Compiler and Linker flags
ARCH		:= -mthumb -mthumb-interwork
CFLAGS		:= $(ARCH) -O2 -Wall -ffunction-sections -fdata-sections
CXXFLAGS	:= $(CFLAGS) -fno-rtti -fno-exceptions
ASFLAGS		:= $(ARCH)
LDFLAGS		:= $(ARCH) -Wl,--gc-sections -Wl,-Map,$(TARGET).map

# Libraries for Wi-Fi, Fat filesystem, and libnds
LIBS		:= -ldswifi9 -lfat -lnds9

ifeq ($(DSi_MODE), 1)
	CFLAGS	+= -D__NDSI__ -DTWL
endif

.PHONY: all clean

all: $(TARGET).nds

clean:
	@echo "Cleaning build artifacts..."
	@rm -rf $(BUILD) $(TARGET).nds $(TARGET).arm9 $(TARGET).arm7 $(TARGET).map

$(TARGET).nds:
	@echo "Building DSMeteo for Nintendo DS / Nintendo DSi..."
	@echo "Target: $(TARGET).nds"
